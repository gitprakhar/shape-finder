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

    const isCanvasCleared = moveCount === 0;
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
    }, [defaultImage, width, height, rotation, isCanvasCleared]);

    useImperativeHandle(ref, () => ({
      getImageBase64: () => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let found = false;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            if (data[idx + 3] > 0) { // non-transparent pixel
              found = true;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (!found) return canvas.toDataURL("image/png"); // nothing drawn
        // Make bounding box square
        const boxWidth = maxX - minX + 1;
        const boxHeight = maxY - minY + 1;
        const size = Math.max(boxWidth, boxHeight);
        // Center the crop if not square
        let cropX = minX - Math.floor((size - boxWidth) / 2);
        let cropY = minY - Math.floor((size - boxHeight) / 2);
        // Clamp cropX/cropY to canvas
        cropX = Math.max(0, cropX);
        cropY = Math.max(0, cropY);
        if (cropX + size > width) cropX = width - size;
        if (cropY + size > height) cropY = height - size;
        // Create a new square canvas
        const cropCanvas = document.createElement("canvas");
        cropCanvas.width = size;
        cropCanvas.height = size;
        const cropCtx = cropCanvas.getContext("2d");
        if (!cropCtx) return null;
        // Do not fill with white, keep transparent background
        // cropCtx.fillStyle = "#fff";
        // cropCtx.fillRect(0, 0, size, size);
        cropCtx.drawImage(canvas, cropX, cropY, size, size, 0, 0, size, size);
        return cropCanvas.toDataURL("image/png");
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