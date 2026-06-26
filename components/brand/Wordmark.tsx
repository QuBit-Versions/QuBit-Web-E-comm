/**
 * Wordmark "QuBit." — SVG inline (geométrico, não-fonte).
 *
 * Exatidão de marca:
 *  - A tinta das letras usa `currentColor` → adapta ao fundo via classe de texto
 *    (text-paper no escuro, text-ink no claro). Nunca mais logo preta sobre fundo preto.
 *  - O ponto + a órbita do "i" são SEMPRE `--brand` (#2B4DFF): é o elétron/qubit,
 *    detalhe fixo da identidade. Não herda a cor do texto.
 */
export function Wordmark({
  className = "text-paper",
  title = "QuBit",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 577 292"
      className={className}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <g transform="translate(70,70)">
        <path
          fillRule="evenodd"
          d="M 0,70 A 70,70 0 1 0 140,70 A 70,70 0 1 0 0,70 Z M 22,70 A 48,48 0 1 0 118,70 A 48,48 0 1 0 22,70 Z"
        />
        <g transform="translate(70,70) rotate(45)">
          <rect x="0" y="-11" width="113.26" height="22" rx="11" />
        </g>
        <rect x="160" y="40" width="22" height="63.5" />
        <rect x="214" y="40" width="22" height="63.5" />
        <path d="M 160,102 A 38,38 0 0 0 236,102 L 214,102 A 16,16 0 0 1 182,102 Z" />
        <rect x="252" y="0" width="22" height="140" />
        <path
          fillRule="evenodd"
          d="M 252.6,35 A 35.4,35.4 0 1 0 323.4,35 A 35.4,35.4 0 1 0 252.6,35 Z M 274.6,35 A 13.4,13.4 0 1 0 301.4,35 A 13.4,13.4 0 1 0 274.6,35 Z"
        />
        <path
          fillRule="evenodd"
          d="M 252.6,105 A 35.4,35.4 0 1 0 323.4,105 A 35.4,35.4 0 1 0 252.6,105 Z M 274.6,105 A 13.4,13.4 0 1 0 301.4,105 A 13.4,13.4 0 1 0 274.6,105 Z"
        />
        <rect x="343.4" y="40" width="22" height="100" />
        {/* elétron/qubit — azul fixo da marca (token --brand, não herda currentColor) */}
        <circle cx="354.4" cy="14" r="13" fill="var(--brand)" />
        <g transform="translate(354.4,14) rotate(-28)">
          <ellipse rx="20" ry="7.64" fill="none" stroke="var(--brand)" strokeWidth="3.5" />
        </g>
        <rect x="395.4" y="15" width="22" height="125" />
        <rect x="377.4" y="40" width="60" height="22" />
        {/* ponto final "." — quadrado azul da marca (assinatura, à base) */}
        <rect x="450" y="118" width="22" height="22" fill="var(--brand)" />
      </g>
    </svg>
  );
}
