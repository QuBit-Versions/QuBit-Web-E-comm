import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { faq } from "@/content/faq";

export function Faq() {
  return (
    <section id="faq" className="section-y px-6">
      <div className="max-w-3xl mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>Perguntas frequentes</p>
        <h2 className="b-item text-h1 text-text-1 mb-16" style={{ ["--i" as string]: 1 } as React.CSSProperties}>Tira as dúvidas antes de falar com a gente.</h2>
        <div className="b-item" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
          <Accordion>
            {faq.map((item) => (
              <AccordionItem key={item.id} id={item.id} question={item.question}>
                <p>{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
