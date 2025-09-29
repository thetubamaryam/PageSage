import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // Summarize text
  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/summarize", { text });
      setSummary(res.data.summary);
    } catch (err) {
      setSummary("Error connecting to backend");
    }
    setLoading(false);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/pdf",
        { content: summary },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "summary.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error generating PDF");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.overlay}>
        <h1 style={styles.title}>PageSage </h1>

        <textarea
          style={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize..."
        />

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          <button
            style={{ ...styles.button, marginLeft: 10 }}
            onClick={handleDownloadPDF}
            disabled={!summary}
          >
            Download PDF
          </button>
        </div>

        {summary && (
          <div style={styles.summaryBox}>
            <h3 style={{ marginBottom: 8 }}>Summary:</h3>
            <div style={styles.scrollableSummary}>{summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  background: {
    backgroundImage: "url('/background.jpg')", // put your JPG in public folder
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)", // darker overlay for contrast
    borderRadius: 12,
    padding: 85,
    maxWidth: 700,
    width: "100%",
    color: "white",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#9b5de5", // soft purple for title
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  textarea: {
    width: "100%",
    height: 150,
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #9b5de5",
    resize: "none",
    backgroundColor: "#1e1e2f", // dark box
    color: "#ffffff", // white text
  },
  buttonContainer: {
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#9b5de5", // purple button
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
  },
  summaryBox: {
    marginTop: 20,
    backgroundColor: "#2a2a40", // dark purple box
    color: "#f1f1f1",
    borderRadius: 8,
    padding: 15,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.3)",
  },
  scrollableSummary: {
    maxHeight: 200,
    overflowY: "auto",
  },
};

export default App;
