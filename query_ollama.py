import json
from lightning_sdk.deployment import Deployment

# make sure to use the same deployment name you used in deploy_ollama.py
deployment = Deployment(name="my-ollama-deployment")

resp = deployment.post(
    "/api/chat",
    json={
        "model": "llama3.1",
        "messages": [{"role": "user", "content": "why is the sky blue?"}],
        "stream": True
    },
    stream=True
)

for el in resp.iter_lines():
    if el:
        try:
            parsed_line = json.loads(el)
            if 'content' in parsed_line['message']:
                print(parsed_line['message']['content'], end='', flush=True)
        except json.JSONDecodeError:
            print(f"could not decode line: {el}", flush=True)
print("\n")