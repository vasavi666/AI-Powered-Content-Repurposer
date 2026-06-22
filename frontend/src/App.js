 import React, { useState } from "react";
import ContentInput from "./components/ContentInput";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className={`container ${result ? "expanded" : ""}`}>
      <h1 className="title">AI Content Repurposer</h1>
      <p className="tagline">Turn a single blog into tweets, posts, and scripts—instantly. 🚀</p>

      <ContentInput onResult={setResult} />

      {result && (
        <div className="results-container">
          <div className="result-card linkedin">
            <h3>LinkedIn Post</h3>
            <p>{result.linkedin}</p>
          </div>
          <div className="result-card youtube">
            <h3>YouTube Script</h3>
            <p>{result.youtube}</p>
          </div>
          <div className="result-card instagram">
            <h3>Instagram Caption</h3>
            <p>{result.instagram}</p>
          </div>
          <div className="result-card twitter">
            <h3>Twitter Thread</h3>
            <p>{result.twitter}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
