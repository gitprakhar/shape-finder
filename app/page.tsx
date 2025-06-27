"use client";
import React, { useRef, useState } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import EntriesForm from "./EntriesForm";

export default function Home() {
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [lastSubmitKey, setLastSubmitKey] = useState(0);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Drawing Canvas</h1>
      <DrawingCanvas ref={canvasRef} />
      <EntriesForm
        key={lastSubmitKey}
        getImageBase64={getImageBase64}
        numberOfMoves={getNumberOfMoves()}
        todaysDate={todaysDate}
        onSubmit={() => {
          clearCanvas();
          setLastSubmitKey((k) => k + 1);
        }}
      />
    </div>
  );
}
