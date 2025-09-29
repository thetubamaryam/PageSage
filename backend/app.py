import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from utils.ai_utils import summarize_text
from utils.pdf_utils import generate_pdf

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Backend is working!"})

@app.route("/test-key")
def test_key():
    api_key = os.getenv("GROQ_API_KEY", "Key not found")
    return jsonify({"GROQ_API_KEY": api_key[:8] + "..."})

@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.get_json()
    text = data.get("text", "")
    summary = summarize_text(text)
    return jsonify({"summary": summary})

@app.route("/pdf", methods=["POST"])
def pdf():
    data = request.get_json()
    content = data.get("content", "")
    pdf_data = generate_pdf(content)
    return app.response_class(
        pdf_data,
        mimetype="application/pdf",
        headers={"Content-Disposition": "attachment;filename=output.pdf"}
    )

if __name__ == "__main__":
    app.run(debug=True)
