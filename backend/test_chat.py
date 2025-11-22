import requests

# Local FastAPI URL for your chat endpoint
URL = "http://127.0.0.1:8000/chat/ask"
HEADERS = {"Content-Type": "application/json"}
TIMEOUT = 10  # seconds

def ask_question(question: str):
    payload = {"q": question}
    try:
        response = requests.post(URL, json=payload, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status() 
        data = response.json()
        answer = data.get("answer", "[No answer returned]")
        print("AI Answer:", answer)
    except requests.exceptions.Timeout:
        print("Error: Request timed out")
    except requests.exceptions.RequestException as e:
        print("Error:", e)
    except ValueError:
        print("Error: Failed to parse JSON response")

if __name__ == "__main__":
    questions = [
        "How much is a bus ticket from Khulna to Daulatpur?",
        "Which bus companies cover Sylhet?",
        "What is Green Line's privacy policy?",
        "What are the Covid-19 guidelines for bus travel?",
        "Tell me about bus routes from Chittagong to Dhaka.",
    ]

    for q in questions:
        print(f"\nQuestion: {q}")
        ask_question(q)

