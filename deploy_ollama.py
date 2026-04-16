from lightning_sdk.deployment import Deployment, AutoScaleConfig, ExecHealthCheck
from lightning_sdk import Machine

# define your deployment with a unique name
deployment = Deployment(name="my-ollama-deployment")

# create the initial release of your ollama deployment
deployment.start(
   image="ollama/ollama:latest", # the official ollama docker image
   entrypoint="sh -c", # the entrypoint for the container
   # the command starts ollama in the background, waits a bit for it to start,
   # then runs llama3.1 to download and load it, and finally waits indefinitely
   command="/bin/ollama serve & sleep 1 && /bin/ollama run llama3.1 && wait",
   machine=Machine.L4,  # selecting an L4 machine (with gpu) for better LLM performance
   autoscale=AutoScaleConfig(
      min_replicas=0,  # scale down to zero if there's no traffic to save costs
      max_replicas=2,  # allow up to 2 replicas for handling traffic
      metric="GPU",    # autoscale based on gpu utilization
      threshold=65,    # when gpu utilization exceeds 65%, scale up
   ),
   ports=[11434], # ollama typically listens on port 11434
   # this health check installs curl and jq (if not present) and then verifies
   # that the llama3.1 model is listed as available in ollama
   health_check=ExecHealthCheck(
      command="apt-get update -qq > /dev/null && apt-get install -qq -y curl jq > /dev/null && curl -f http://localhost:11434/api/tags | jq -e '.models[] | select(.model == \"llama3.1\")'"
   ),
   # setting replicas to 1 initially to ensure the service starts and the model downloads
   replicas=1,
)

print(f"ollama deployment '{deployment.name}' is starting up. it might take a few minutes for the model to download and become ready.")
print("you can monitor its status on the lightning.ai dashboard under deployments.")