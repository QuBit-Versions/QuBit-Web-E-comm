import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { legal_pages, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `${legal_pages.privacidade.title} — ${site.name}`,
  description: legal_pages.privacidade.intro,
};

export default function PrivacidadePage() {
  return <LegalPage content={legal_pages.privacidade} />;
}
