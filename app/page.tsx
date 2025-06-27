"use client";
import React, { useRef } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import GuessForm from "./GuessForm";

export default function Home() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);

  const getImageBase64 = () => {
    return canvasRef.current?.getImageBase64() || null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Drawing Canvas</h1>
      <DrawingCanvas ref={canvasRef} />
      <GuessForm getImageBase64={getImageBase64} />
    </div>
  );
}
