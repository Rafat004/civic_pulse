import requests

try:
    response = requests.post(
        "http://localhost:8000/api/v1/complaints/",
        headers={
            "Origin": "http://localhost:3000",
        },
        data={
            "description": "Test pothole",
            "category": "pothole",
            "lat": "40.7128",
            "lng": "-74.0060"
        },
        files={
            "photo": ("", b"") # Send empty file to force multipart/form-data
        }
    )
    print("Status:", response.status_code)
    print("Headers:", response.headers)
    print("Body:", response.text)
except Exception as e:
    print("Error:", e)
