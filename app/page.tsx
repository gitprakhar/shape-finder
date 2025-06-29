"use client";
import React, { useRef, useState, useEffect } from "react";
import DrawingCanvas, { DrawingCanvasHandle } from "./DrawingCanvas";
import LandingPage from "./LandingPage";

export default function Home() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState("username");
  const [nameForImage, setNameForImage] = useState("what is this?");
  const [submitting, setSubmitting] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const submitSpanRef = useRef<HTMLSpanElement>(null);
  const [submitWidth, setSubmitWidth] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<{ username: string; score: number; image_base64?: string }[]>([]);
  const [randomScore, setRandomScore] = useState<number | null>(null);
  const [defaultImage, setDefaultImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [moves, setMoves] = useState(0);

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
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth + 8); // +8 for cursor padding
    }
  }, [nameForImage]);

  useEffect(() => {
    if (submitSpanRef.current) {
      setSubmitWidth(submitSpanRef.current.offsetWidth + 8); // +8 for padding
    }
  }, [submitting]);

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
      // Show leaderboard overlay
      setShowLeaderboard(true);
      setRandomScore(83); // random for now
      // Fetch last 3 entries
      const res = await fetch("/api/entries/last3");
      const data = await res.json();
      setLeaderboardEntries(data.entries || []);
    } catch {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {showLandingPage ? (
        <LandingPage onStartDrawing={handleStartDrawing} />
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
          {/* Number of moves at the top right */}
          {!showLeaderboard && (
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 48,
                color: "#000",
                fontWeight: 700,
                fontSize: 32,
                fontFamily: "'UglyDave', Helvetica, Arial, sans-serif",
                zIndex: 10,
                background: "transparent",
              }}
            >
              {moves} moves
            </div>
          )}
          {/* Canvas fills the page */}
          {!showLeaderboard && (
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
              rotation={rotation}
            />
          )}
          {/* Centered submit button at the bottom */}
          {!showLeaderboard && (
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
                style={{
                  fontFamily: 'Helvetica Now Display Bold',
                  fontSize: 20,
                  color: "#000000",
                  background: "transparent",
                  border: "none",
                  textDecoration: "underline",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {submitting ? "submitting..." : "submit"}
              </button>
            </div>
          )}
          {/* Leaderboard overlay */}
          {showLeaderboard && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "#E6E6E6",
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: 48,
              }}
            >
              <div style={{ color: "#0057FF", fontWeight: 700, fontSize: 36, marginBottom: 32 }}>
                Your score is {randomScore}/100
              </div>
              <div style={{ color: "#0057FF", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
                leaderboard
              </div>
              <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
                {leaderboardEntries.map((entry, idx) => (
                  <div key={idx} style={{ background: "#e6e6e6", width: 320, height: 320, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                    {entry.image_base64 && (
                      <img
                        src={entry.image_base64}
                        alt={entry.username}
                        style={{ width: "100%", height: 240, objectFit: "contain", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                      />
                    )}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", padding: "0 16px 16px 16px" }}>
                      <span style={{ color: "#0057FF", fontWeight: 700, fontSize: 24 }}>{entry.username}</span>
                      <span style={{ color: "#0057FF", fontWeight: 700, fontSize: 24 }}>{entry.score}</span>
                    </div>
                  </div>
                ))}
                {/* Fill empty squares if less than 3 */}
                {Array.from({ length: 3 - leaderboardEntries.length }).map((_, idx) => (
                  <div key={"empty-" + idx} style={{ background: "#e6e6e6", width: 320, height: 320, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }} />
                ))}
              </div>
              <button
                style={{
                  position: "absolute",
                  right: 48,
                  bottom: 32,
                  color: "#0057FF",
                  fontWeight: 700,
                  fontSize: 24,
                  background: "transparent",
                  border: "none",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => window.location.reload()}
              >
                play again
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
