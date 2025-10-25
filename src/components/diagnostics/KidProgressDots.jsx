export default function KidProgressDots({ current, total }) {
  return (
    <div className="flex justify-center items-center mb-6 flex-wrap gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            "inline-block rounded-full w-3 h-3",
            i < current ? "bg-sky-400" : i === current ? "bg-sky-600" : "bg-slate-300"
          ].join(" ")}
        />
      ))}
    </div>
  );
}