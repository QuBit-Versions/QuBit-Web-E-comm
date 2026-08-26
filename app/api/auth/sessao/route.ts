import { NextResponse } from "next/server";
import { getEmpresaLogada } from "@/lib/auth";

/** Estado da sessão para a UI (Header). Não expõe dados sensíveis. */
export async function GET() {
  const empresa = await getEmpresaLogada();
  return NextResponse.json(
    { loggedIn: !!empresa },
    { headers: { "Cache-Control": "no-store" } },
  );
}
