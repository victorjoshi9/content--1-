import express from "express";
import dotenv from "dotenv";
import { Sandbox } from "@e2b/code-interpreter";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json({ limit: "4mb" }));

const port = Number(process.env.SANDBOX_API_PORT || 8787);

function requireE2BKey() {
  if (!process.env.E2B_API_KEY) {
    throw new Error("E2B_API_KEY is not configured");
  }
}

app.get("/health", (_req, res) => {
  const keyConfigured = Boolean(process.env.E2B_API_KEY);
  res.json({
    ok: true,
    provider: "e2b",
    keyConfigured,
    port,
  });
});

app.post("/execute", async (req, res) => {
  const code = req.body?.code;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Request body must include string field 'code'" });
  }

  let sandbox;
  try {
    requireE2BKey();
    sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY });
    const execution = await sandbox.runCode(code);

    return res.json({
      ok: true,
      provider: "e2b",
      text: execution?.text || "",
      results: execution?.results || [],
      logs: execution?.logs || {},
      error: execution?.error || null,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "e2b",
      error: error?.message || "Failed to execute code in E2B sandbox",
    });
  } finally {
    if (sandbox && typeof sandbox.kill === "function") {
      await sandbox.kill();
    }
  }
});

app.post("/upload", async (req, res) => {
  const filePath = req.body?.path;
  const content = req.body?.content;
  const encoding = req.body?.encoding || "utf8";

  if (!filePath || typeof filePath !== "string") {
    return res.status(400).json({ error: "Request body must include string field 'path'" });
  }
  if (typeof content !== "string") {
    return res.status(400).json({ error: "Request body must include string field 'content'" });
  }

  let sandbox;
  try {
    requireE2BKey();
    sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY });

    const payload = encoding === "base64" ? Buffer.from(content, "base64") : content;
    await sandbox.files.write(filePath, payload);

    return res.json({ ok: true, provider: "e2b", path: filePath, encoding });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      provider: "e2b",
      error: error?.message || "Failed to upload file to E2B sandbox",
    });
  } finally {
    if (sandbox && typeof sandbox.kill === "function") {
      await sandbox.kill();
    }
  }
});

app.listen(port, () => {
  console.log(`E2B sandbox API listening on http://localhost:${port}`);
});
