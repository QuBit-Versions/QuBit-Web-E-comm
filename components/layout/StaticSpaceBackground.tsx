/**
 * Fundo cósmico ESTÁTICO (CSS puro, custo ~zero): brilho aurora sobre o ink.
 * Serve de base sempre presente e, no tier "low" (GPU fraca/sem WebGL/Save-Data),
 * substitui totalmente o canvas 3D — preserva a atmosfera sem pesar.
 */
export function StaticSpaceBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-ink"
      style={{
        backgroundImage: `
          radial-gradient(1100px 620px at 72% 16%, color-mix(in srgb, var(--g-3) 16%, transparent), transparent 62%),
          radial-gradient(900px 520px at 18% 82%, color-mix(in srgb, var(--g-2) 12%, transparent), transparent 60%),
          radial-gradient(700px 700px at 50% 50%, color-mix(in srgb, var(--brand) 5%, transparent), transparent 70%)
        `,
      }}
    />
  );
}
