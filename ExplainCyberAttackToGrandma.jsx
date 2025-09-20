import React, { useState } from "react";

export default function ExplainCyberAttackToGrandma() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:3000";

  async function handleGenerate() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`${API_BASE}/api/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });
      const data = await res.json();
      setOutput(data);
    } catch (e) {
      setOutput({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Explain a Cyber Attack to My Grandma</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        className="w-full p-3 rounded-lg border border-gray-300"
        placeholder="Paste incident description here..."
      />
      <button
        onClick={handleGenerate}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {loading ? "Thinking..." : "Explain to Grandma"}
      </button>

      {output && !output.error && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold">Analogy</h3>
            <p>{output.analogy}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold">Narrative</h3>
            <p>{output.narrative.story}</p>
            <ul className="list-disc ml-5 mt-2">
              {output.narrative.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold">Timeline</h3>
            <div dangerouslySetInnerHTML={{ __html: output.timeline }} />
          </div>
        </div>
      )}

      {output && output.error && (
        <div className="mt-4 text-red-600">Error: {output.error}</div>
      )}
    </div>
  );
}
