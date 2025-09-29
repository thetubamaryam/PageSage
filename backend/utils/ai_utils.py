import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarize_text(text):
    """
    Summarizes input text using Groq LLaMA model.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # fast + cheap model
            messages=[
                {"role": "system", "content": "You are an AI that summarizes text clearly."},
                {"role": "user", "content": f"Summarize this text:\n\n{text}"}
            ],
            temperature=0.5,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"
