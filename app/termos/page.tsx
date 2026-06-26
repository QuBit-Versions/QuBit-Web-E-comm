import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { legal_pages, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `${legal_pages.termos.title} — ${site.name}`,
  description: legal_pages.termos.intro,
};

export default function TermosPage() {
  return <LegalPage content={legal_pages.termos} />;
}
