"use client";
import React, { useState } from "react";

interface GuessFormProps {
  getImageBase64: () => string | null;
}

export default function GuessForm({ getImageBase64 }: GuessFormProps) {
  const [username, setUsername] = useState("");
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim() || !username.trim()) return;
    setSubmitting(true);
    try {
      const image_base64 = getImageBase64();
      await fetch("/api/guesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, guess, image_base64 }),
      });
      setGuess("");
      setUsername("");
    } catch {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleGuessSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
      <label htmlFor="username-input">Username</label>
      <input
        id="username-input"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={submitting}
        placeholder="Enter your username"
      />
      <label htmlFor="guess-input">Guesses</label>
      <input
        id="guess-input"
        type="text"
        value={guess}
        onChange={e => setGuess(e.target.value)}
        disabled={submitting}
        placeholder="Enter your guess"
      />
      <button type="submit" disabled={submitting || !guess.trim() || !username.trim()}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
} 