"use client";
import React, { useState } from "react";

export default function GuessForm() {
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