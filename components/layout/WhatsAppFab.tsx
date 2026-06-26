import { site, socials } from "@/content/copy";

export function WhatsAppFab() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    site.whatsappMessage
  )}`;
  const instagram = socials.find((s) => s.id === "instagram");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {instagram && (
        <a
          href={instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguir no Instagram"
          className="flex items-center justify-center w-14 h-14 rounded-full surface-glass-strong border border-line text-text-1 [box-shadow:var(--elev-2)] hover:scale-105 hover:text-brand-text active:scale-95 transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <InstagramIcon />
        </a>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp text-paper [box-shadow:0_8px_30px_-6px_color-mix(in_srgb,var(--whatsapp)_60%,transparent)] hover:scale-105 hover:[box-shadow:0_10px_40px_-6px_color-mix(in_srgb,var(--whatsapp)_75%,transparent)] active:scale-95 transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}

// Ícone de marca em SVG próprio (lucide removeu os de marca por trademark).
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      className="w-6 h-6"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.116 1.532 5.845L.057 23.886a.5.5 0 0 0 .606.607l6.102-1.459A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.93 0-3.74-.523-5.295-1.433l-.38-.225-3.962.947.98-3.876-.248-.397A9.952 9.952 0 0 1 2 12C2 6.478 6.477 2 12 2s10 4.478 10 10-4.477 10-10 10z" />
    </svg>
  );
}
