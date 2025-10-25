import React, { useEffect, useState } from 'react';

export default function GameArcade() {
  const [iframeAllowed, setIframeAllowed] = useState(true);
  
  // Use Vite's base URL to construct the correct path
  const arcadeUrl = `${import.meta.env.BASE_URL}game-arcade.html`;

  useEffect(() => {
    // quick feature-detect: try to load the iframe src in a hidden iframe to ensure it's reachable
    const test = document.createElement('iframe');
    test.style.display = 'none';
    test.src = arcadeUrl;
    const timer = setTimeout(() => {
      // if it hasn't loaded in 3s assume cross-origin/frame blocking and fallback to fetch
      setIframeAllowed(true);
      document.body.removeChild(test);
    }, 3000);
    test.onload = () => {
      clearTimeout(timer);
      setIframeAllowed(true);
      document.body.removeChild(test);
    };
    test.onerror = () => {
      clearTimeout(timer);
      setIframeAllowed(false);
      document.body.removeChild(test);
    };
    document.body.appendChild(test);
    return () => { try { document.body.removeChild(test); } catch (e) {} };
  }, [arcadeUrl]);

  // Render arcade as iframe so scripts/styles inside arcade.html run in their own document
  return (
    <div className="prose max-w-none">
      {iframeAllowed ? (
        <iframe title="JVDT Game Arcade" src={arcadeUrl} className="w-full h-[80vh] border rounded-lg" />
      ) : (
        <div>
          <p>Arcade cannot be embedded. You can open <a className="text-indigo-600" href={arcadeUrl} target="_blank" rel="noreferrer">the standalone arcade page</a> in a new tab.</p>
        </div>
      )}
    </div>
  );
}
