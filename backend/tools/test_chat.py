import requests

# local FastAPI URL for the correct endpoint
URL = "http://127.0.0.1:8000/ask"  

def ask_question(question):
    payload = {"q": question}  
    response = requests.post(URL, json=payload)
    if response.status_code == 200:
        data = response.json()
        print("AI Answer:", data["answer"])
    else:
        print("Error:", response.status_code, response.text)

if __name__ == "__main__":
    questions = [
        "How much is a bus ticket from Dhaka to Gabtoli?",
        "Which bus companies cover Sylhet?",
        "What is Green Line's privacy policy?",
    ]
    for q in questions:
        print(f"\nQuestion: {q}")
        ask_question(q)
