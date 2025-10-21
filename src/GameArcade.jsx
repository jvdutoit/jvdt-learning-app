import React, { useEffect, useState } from 'react';

export default function GameArcade() {
  const [arcadeHTML, setArcadeHTML] = useState('');
  useEffect(() => {
    let mounted = true;
    fetch('/arcade.html')
      .then((r) => r.text())
      .then((html) => {
        if (mounted) setArcadeHTML(html);
      })
      .catch((e) => {
        if (mounted) setArcadeHTML('<p>Failed to load arcade content.</p>');
      });
    return () => { mounted = false };
  }, []);

  return (
    <div className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: arcadeHTML }} />
    </div>
  );
}
