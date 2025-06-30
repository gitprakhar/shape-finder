/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

interface LandingPageProps {
  onStartDrawing: () => void;
}

export default function LandingPage({ onStartDrawing }: LandingPageProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#E599FE",
        fontFamily: 'Helvetica Now Display Bold',
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "48px",
      }}
    >
      {/* SVG at the top */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="/home-text.svg"
          alt="Home Text"
          style={{
            width: "90%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
      
      {/* Start Drawing button at the bottom */}
      <button
        onClick={onStartDrawing}
        className="pink-button"
        style={{ fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif' }}
      >
        start drawing
      </button>
    </div>
  );
} 