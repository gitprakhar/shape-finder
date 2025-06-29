"use client";
import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react";

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
  onMove?: (moveCount: number) => void;
  defaultImage?: string | null;
  rotation?: number;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  ({ width = 600, height = 300, style, onMove, defaultImage, rotation = 0, ...rest }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
    const [drawing, setDrawing] = useState(false);
    const [moveCount, setMoveCount] = useState(0);

    useEffect(() => {
      if (onMove) onMove(moveCount);
    }, [moveCount, onMove]);

    // Draw default image when it changes, or when canvas size/rotation changes, or when cleared
    useEffect(() => {
      if (defaultImage && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new window.Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          const drawWidth = canvas.width * 0.75;
          const drawHeight = canvas.height * 0.75;
          ctx.drawImage(
            img,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
          );
          ctx.restore();
        };
        img.src = defaultImage;
      }
    }, [defaultImage, width, height, rotation, moveCount === 0]);

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
      ctx.lineWidth = 6;
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