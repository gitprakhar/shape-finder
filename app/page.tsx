"use client";
import React, { useRef, useState, useEffect } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";

export default function Home() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState("username");
  const [nameForImage, setNameForImage] = useState("what is this?");
  const [submitting, setSubmitting] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const submitSpanRef = useRef<HTMLSpanElement>(null);
  const [submitWidth, setSubmitWidth] = useState<number>(0);

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

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 8); // +8 for cursor padding
    }
  }, [nameForImage]);

  useEffect(() => {
    if (submitSpanRef.current) {
      setSubmitWidth(submitSpanRef.current.offsetWidth + 8); // +8 for padding
    }
  }, [submitting]);

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
          onFocus={() => { if (username === "username") setUsername(""); }}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            outline: "none",
            minWidth: "100px",
            width: `${Math.max(username.length, 8)}ch`,
            marginRight: 16,
            textAlign: "left",
            transition: "width 0.2s",
          }}
        />
        {/* Hidden span for measuring input width */}
        <span
          ref={spanRef}
          style={{
            position: "absolute",
            visibility: "hidden",
            height: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "normal",
          }}
        >
          {nameForImage || " "}
        </span>
        <input
          type="text"
          value={nameForImage}
          onChange={e => setNameForImage(e.target.value)}
          onFocus={() => { if (nameForImage === "what is this?") setNameForImage(""); }}
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            outline: "none",
            minWidth: "60px",
            maxWidth: "250px",
            width: inputWidth,
            textAlign: "left",
            transition: "width 0.2s",
          }}
        />
        {/* Hidden span for measuring submit button width */}
        <span
          ref={submitSpanRef}
          style={{
            position: "absolute",
            visibility: "hidden",
            height: 0,
            overflow: "hidden",
            whiteSpace: "pre",
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "normal",
          }}
        >
          {submitting ? "submitting..." : "submit"}
        </span>
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
            width: submitWidth,
            textAlign: "right",
            opacity: submitting ? 0.6 : 1,
            transition: "width 0.2s",
          }}
        >
          {submitting ? "submitting..." : "submit"}
        </button>
      </div>
    </div>
  );
}
