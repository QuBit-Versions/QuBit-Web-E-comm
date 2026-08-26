import { Fragment } from "react";

/**
 * Quebra um texto em letras que surgem uma a uma (efeito "montar o texto"),
 * dentro de um bloco do scrollytelling.
 *
 * IMPORTANTE — por que existe o envelope `.b-word`: cada letra é um
 * `inline-block` (preciso para animar transform). Sem agrupar por palavra, o
 * navegador trata CADA LETRA como uma caixa independente e pode quebrar a linha
 * no meio da palavra ("cre/scimento", "neg/ócio"). O `.b-word` é
 * `inline-block; white-space: nowrap`, então a quebra só acontece nos espaços
 * entre palavras — como em qualquer texto.
 *
 * Acessível: o texto real fica no `aria-label`; as letras são `aria-hidden`.
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
  const words = text.split(" ");
  const total = Array.from(text).length;
  const center = (total - 1) / 2;

  let i = 0; // índice global do caractere → mantém a cascata contínua

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, w) => {
        const letters = Array.from(word);
        const span = (
          <span aria-hidden className="b-word">
            {letters.map((ch, k) => {
              const gi = i++;
              const dir = gi < center ? -1 : gi > center ? 1 : 0;
              return (
                <span
                  key={k}
                  className="b-char"
                  style={
                    { ["--i" as string]: start + gi, ["--dir" as string]: dir } as React.CSSProperties
                  }
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        i++; // o espaço também conta, para a cascata não "acelerar" entre palavras
        return (
          <Fragment key={w}>
            {span}
            {w < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
