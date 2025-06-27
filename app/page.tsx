import React, { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";

function GuessForm() {
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    
    setSubmitting(true);
    try {
      await fetch("/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess }),
      });
      setGuess("");
    } catch {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleGuessSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
      <label htmlFor="guess-input">Guesses</label>
      <input
        id="guess-input"
        type="text"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        disabled={submitting}
        placeholder="Enter your guess"
      />
      <button type="submit" disabled={submitting || !guess.trim()}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Drawing Canvas</h1>
      <DrawingCanvas />
      <GuessForm />
    </div>
  );
}
