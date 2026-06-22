import React, { useState } from "react";
import axios from "axios";

function ContentInput({ onResult }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/repurpose", {
        content: text,
      });
      onResult(response.data); // send result to parent
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check backend.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Write once, use everywhere ✨</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="8"
          cols="80"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your blog/article text here..."
        />
        <br />
        <button type="submit">Generate Content</button>
      </form>
    </div>
  );
}

export default ContentInput;
