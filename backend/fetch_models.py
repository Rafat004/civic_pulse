import requests
import json

response = requests.get("https://openrouter.ai/api/v1/models")
data = response.json()

free_models = []
for model in data.get('data', []):
    pricing = model.get('pricing', {})
    if pricing.get('prompt') == '0' and pricing.get('completion') == '0':
        free_models.append(model['id'])

print("Found free models:", json.dumps(free_models[:20], indent=2))
