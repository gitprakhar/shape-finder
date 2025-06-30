"use client";
import React, { useRef, useState, useEffect } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import LandingPage from "./LandingPage";
import { useRouter } from 'next/navigation';
import ScoreSubmitPage from "./ScoreSubmitPage";

export default function Home() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState("username");
  const [nameForImage, setNameForImage] = useState("what is this?");
  const [submitting, setSubmitting] = useState(false);
  const [defaultImage, setDefaultImage] = useState<string | null>(null);
  const [moves, setMoves] = useState(0);
  const router = useRouter();
  const [showScoreSubmit, setShowScoreSubmit] = useState(false);

  const handleStartDrawing = () => {
    setShowLandingPage(false);
  };

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
    // Fetch the default image (username: pm17, name_for_image: default)
    fetch("/api/entries/default-image")
      .then(res => res.json())
      .then(data => {
        if (data && data.image_base64) setDefaultImage(data.image_base64);
      });
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
      // Instead of submitting, show the score submit page
      setShowScoreSubmit(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showLandingPage ? (
        <LandingPage onStartDrawing={handleStartDrawing} />
      ) : showScoreSubmit ? (
        <ScoreSubmitPage
          image_base64={getImageBase64() || ''}
          number_of_moves={getNumberOfMoves()}
          name_for_image={nameForImage}
          todays_date={todaysDate}
          score={84}
        />
      ) : (
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            background: "#E599FE",
            fontFamily: 'Helvetica Now Display Bold',
            overflow: "hidden",
          }}
        >
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
              background: "#E599FE",
            }}
            onMove={setMoves}
            defaultImage={defaultImage}
          />
          {/* Centered submit button at the bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 48,
              left: 0,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="pink-button"
              style={{ fontFamily: 'Barlow_Condensed, Arial, Helvetica, sans-serif' }}
            >
              {submitting ? "submitting..." : "submit"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
