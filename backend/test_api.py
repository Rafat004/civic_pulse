import requests

try:
    response = requests.post(
        "http://localhost:8000/api/v1/complaints/",
        data={
            "description": "Test pothole",
            "category": "pothole",
            "lat": "40.7128",
            "lng": "-74.0060"
        }
    )
    print("Status:", response.status_code)
    print("Headers:", response.headers)
    print("Body:", response.text)
except Exception as e:
    print("Error:", e)
