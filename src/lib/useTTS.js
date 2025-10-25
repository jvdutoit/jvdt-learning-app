export function useTTS() {
  const start = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };
  
  const stop = () => {
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      // Ignore errors
    }
  };
  
  return { start, stop };
}