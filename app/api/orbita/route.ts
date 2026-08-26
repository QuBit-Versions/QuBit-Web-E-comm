import { NextResponse } from "next/server";
import { getOrbitPartners } from "@/lib/orbita";

/** Parceiros em órbita para as camadas client-side (3D). Dados públicos por design. */
export async function GET() {
  const partners = await getOrbitPartners();
  return NextResponse.json(partners, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
