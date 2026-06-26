/**
 * Quebra um texto em letras que surgem e se emparelham uma a uma (efeito
 * "montar o texto"), dentro de um bloco do scrollytelling. Cada caractere é um
 * `.b-char` com índice de cascata `--i`. Acessível: o texto real fica no
 * `aria-label`; as letras visuais são `aria-hidden`.
 */
export function SplitText({
  text,
  className = "",
  start = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  start?: number;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  const chars = Array.from(text);
  const center = (chars.length - 1) / 2;
  return (
    <Tag className={className} aria-label={text}>
      {chars.map((ch, i) => {
        const dir = i < center ? -1 : i > center ? 1 : 0; // esquerda / direita / centro
        return (
          <span
            key={i}
            aria-hidden
            className="b-char"
            style={{ ["--i" as string]: start + i, ["--dir" as string]: dir } as React.CSSProperties}
          >
            {ch}
          </span>
        );
      })}
    </Tag>
  );
}
