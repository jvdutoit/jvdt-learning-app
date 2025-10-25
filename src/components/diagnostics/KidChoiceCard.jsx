const base = "rounded-3xl border-4 p-6 md:p-8 cursor-pointer shadow-lg transition-transform focus:outline-none focus:ring-4";
const paletteA = "bg-[#d9ecff] border-[#7db6ff] hover:-translate-y-0.5";
const paletteB = "bg-[#fde2e6] border-[#f5a7b2] hover:-translate-y-0.5";

export default function KidChoiceCard({ 
  palette, 
  title, 
  text, 
  emoji, 
  selected = false, 
  onClick, 
  ariaLabel 
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      className={`${base} ${palette === "A" ? paletteA : paletteB} ${
        selected ? "ring-4 ring-sky-400 scale-[0.99]" : ""
      }`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="text-5xl md:text-6xl text-center" aria-hidden="true">
        {emoji}
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-slate-800 mt-2 text-center">
        {title}
      </div>
      <div className="text-lg md:text-xl text-slate-700 mt-3 text-center">
        {text}
      </div>
    </button>
  );
}