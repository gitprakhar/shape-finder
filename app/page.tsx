"use client";
import React, { useRef, useState, useEffect } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import EntriesForm from "./EntriesForm";

export default function Home() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [lastSubmitKey, setLastSubmitKey] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState("username");
  const [nameForImage, setNameForImage] = useState("what is this?");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Set initial size
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    // Update on resize
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getImageBase64 = () => {
    return canvasRef.current?.getImageBase64() || null;
  };
  const getNumberOfMoves = () => {
    return canvasRef.current?.getNumberOfMoves() || 0;
  };
  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
  };

  const todaysDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!username.trim() || !nameForImage.trim()) return;
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
          number_of_moves: getNumberOfMoves(),
          todays_date: todaysDate,
        }),
      });
      setNameForImage("what is this?");
      setUsername("username");
      clearCanvas();
      setLastSubmitKey((k) => k + 1);
    } catch {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#E6E6E6",
        fontFamily: 'Helvetica Now Display Bold',
        overflow: "hidden",
      }}
    >
      {/* Prompt at the very top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          textAlign: "left",
          color: "#0057FF",
          fontWeight: 700,
          fontSize: 36,
          fontFamily: 'Helvetica Now Display Bold',
          zIndex: 10,
          background: "transparent",
          padding: "32px 0 0 48px",
        }}
      >
        Make a shape from the existing shape. Use as few moves as you can. Be as creative as you want. Tell us what you made.
      </div>
      {/* Canvas fills the page */}
      <DrawingCanvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          background: "#E6E6E6",
        }}
      />
      {/* Form fields at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 48px",
          zIndex: 2,
        }}
      >
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            outline: "none",
            width: 180,
            marginRight: 16,
          }}
        />
        <input
          type="text"
          value={nameForImage}
          onChange={e => setNameForImage(e.target.value)}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            outline: "none",
            width: 220,
            textAlign: "center",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !username.trim() || !nameForImage.trim()}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            cursor: submitting ? "not-allowed" : "pointer",
            width: 120,
            textAlign: "right",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "submitting..." : "submit"}
        </button>
      </div>
    </div>
  );
}
