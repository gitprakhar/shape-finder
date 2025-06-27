"use client";
import React from "react";
import DrawingCanvas from "./DrawingCanvas";
import GuessForm from "./GuessForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Drawing Canvas</h1>
      <DrawingCanvas />
      <GuessForm />
    </div>
  );
}
