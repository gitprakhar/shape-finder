"use client";
import React, { useRef, useState } from "react";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [guess, setGuess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.getContext("2d")!.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(
      e.nativeEvent.clientX - rect.left,
      e.nativeEvent.clientY - rect.top
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.clientX - rect.left,
      e.nativeEvent.clientY - rect.top
    );
  };

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
    } catch (err) {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{ border: "1px solid #000", background: "#fff", marginBottom: 24 }}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
      />
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
    </div>
  );
} 