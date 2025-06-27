"use client";
import React, { useRef, useState, useEffect } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import EntriesForm from "./EntriesForm";

export default function Home() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [lastSubmitKey, setLastSubmitKey] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
      {/* Prompt at the top */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 0,
          width: "100%",
          textAlign: "center",
          color: "#0057FF",
          fontWeight: 700,
          fontSize: 36,
          fontFamily: 'Helvetica Now Display Bold',
        }}
      >
        Make a shape from the existing shape. Use as few moves as you can. Be as creative as you want. Tell us what you made.
      </div>
      {/* Canvas fills the page */}
      <canvas
        ref={canvasRef as any}
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
          defaultValue="username"
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
          defaultValue="what is this?"
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
          style={{
            fontFamily: 'Helvetica Now Display Bold',
            fontSize: 24,
            color: "#0057FF",
            background: "transparent",
            border: "none",
            borderBottom: "2px solid #0057FF",
            cursor: "pointer",
            width: 120,
            textAlign: "right",
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
}
