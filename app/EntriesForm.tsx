"use client";
import React, { useState } from "react";

interface EntriesFormProps {
  getImageBase64: () => string | null;
  numberOfMoves: number;
  todaysDate: string;
  onSubmit?: () => void;
}

export default function EntriesForm({ getImageBase64, numberOfMoves, todaysDate, onSubmit }: EntriesFormProps) {
  const [username, setUsername] = useState("");
  const [nameForImage, setNameForImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEntriesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameForImage.trim() || !username.trim()) return;
    setSubmitting(true);
    try {
      const image_base64 = getImageBase64();
      await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          image_base64,
          name_for_image: nameForImage,
          number_of_moves: numberOfMoves,
          todays_date: todaysDate,
        }),
      });
      setNameForImage("");
      setUsername("");
      if (onSubmit) onSubmit();
    } catch {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleEntriesSubmit} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
      <label htmlFor="username-input">Username</label>
      <input
        id="username-input"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        disabled={submitting}
        placeholder="Enter your username"
      />
      <label htmlFor="name-for-image-input">Name for Image</label>
      <input
        id="name-for-image-input"
        type="text"
        value={nameForImage}
        onChange={e => setNameForImage(e.target.value)}
        disabled={submitting}
        placeholder="Enter a name for your image"
      />
      <button type="submit" disabled={submitting || !nameForImage.trim() || !username.trim()}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
} 