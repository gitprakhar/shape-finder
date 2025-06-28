"use client";
import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";

export type DrawingCanvasHandle = {
  getImageBase64: () => string | null;
  getNumberOfMoves: () => number;
  clearCanvas: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

interface DrawingCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ width = 600, height = 300, style, ...rest }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
    const [drawing, setDrawing] = useState(false);
    const [moveCount, setMoveCount] = useState(0);

    useImperativeHandle(ref, () => ({
      getImageBase64: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.toDataURL("image/png");
      },
      getNumberOfMoves: () => moveCount,
      clearCanvas: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
        setMoveCount(0);
      },
      canvasRef,
    }));

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      setDrawing(true);
      setMoveCount((c) => c + 1);
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

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={style}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
        {...rest}
      />
    );
  }
);

DrawingCanvas.displayName = "DrawingCanvas";

export default DrawingCanvas; 