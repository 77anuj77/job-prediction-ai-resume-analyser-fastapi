export function Chrome() {
  return (
    <>
      {/* Soft ambient orbs — fixed, subtle, non-interactive */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.10),transparent_60%)]" />
        <div className="absolute -bottom-52 right-[-12rem] h-[48rem] w-[48rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,159,110,0.09),transparent_62%)]" />
        <div className="absolute left-1/3 top-1/4 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,146,173,0.10),transparent_60%)]" />
      </div>

      {/* Film-grain noise — fixed, pointer-events-none */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}