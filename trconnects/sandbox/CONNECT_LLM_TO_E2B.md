# Connect LLMs to E2B (Sandbox API Mode)

This project now uses E2B for sandbox execution in `trconnects/sandbox/api/server.js`.

## Environment

Create or update `trconnects/sandbox/.env`:

```env
E2B_API_KEY=e2b_***
SANDBOX_API_PORT=8787
```

## Local API endpoints

- `GET /health`
- `POST /execute` with `{ "code": "print('hello')" }`
- `POST /upload` with `{ "path": "/home/user/test.txt", "content": "abc" }`

## Generic function-calling pattern

1. Ask your LLM to call an `execute_python` tool.
2. Tool handler sends code to `POST /execute`.
3. Return execution result to the LLM.

## OpenAI style (Node.js)

```js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const messages = [{ role: "user", content: "Count r in strawberry" }];

const response = await client.chat.completions.create({
  model: "gpt-4o",
  messages,
  tools: [{
    type: "function",
    function: {
      name: "execute_python",
      description: "Execute Python code in E2B sandbox",
      parameters: {
        type: "object",
        properties: { code: { type: "string" } },
        required: ["code"]
      }
    }
  }]
});

const call = response.choices[0].message.tool_calls?.[0];
if (call?.function?.name === "execute_python") {
  const args = JSON.parse(call.function.arguments || "{}");
  const execRes = await fetch("http://localhost:8787/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: args.code })
  });
  const execData = await execRes.json();
  messages.push(response.choices[0].message);
  messages.push({
    role: "tool",
    tool_call_id: call.id,
    name: "execute_python",
    content: JSON.stringify(execData)
  });
}
```

## Anthropic style (Python)

```python
import requests
from anthropic import Anthropic

client = Anthropic(api_key="YOUR_ANTHROPIC_KEY")

tools = [{
    "name": "execute_python",
    "description": "Execute Python code in E2B sandbox",
    "input_schema": {
        "type": "object",
        "properties": {"code": {"type": "string"}},
        "required": ["code"]
    }
}]

msg = client.messages.create(
    model="claude-3-5-sonnet-20240620",
    max_tokens=512,
    tools=tools,
    messages=[{"role": "user", "content": "Count r in strawberry"}]
)

if msg.stop_reason == "tool_use":
    tool_use = next(block for block in msg.content if block.type == "tool_use")
    result = requests.post(
        "http://localhost:8787/execute",
        json={"code": tool_use.input["code"]},
        timeout=60,
    ).json()
    print(result)
```

## Ollama style (Python)

```python
import requests
import ollama

response = ollama.chat(
    model="llama3.2",
    messages=[
        {"role": "system", "content": "Respond with Python code only."},
        {"role": "user", "content": "Count r in strawberry"}
    ]
)

code = response["message"]["content"]
result = requests.post("http://localhost:8787/execute", json={"code": code}, timeout=60).json()
print(result)
```

## Run order

```bash
cd trconnects/sandbox
bash scripts/init_sandbox.sh
bash scripts/start_sandbox.sh
bash scripts/check_api.sh
```

If Docker Compose is unavailable, scripts run in API-only mode and still support E2B execution.
