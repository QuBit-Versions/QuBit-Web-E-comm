import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege a área logada (/painel): sem cookie de sessão → /entrar.
 * A validação REAL da sessão (banco) acontece na página, em getEmpresaLogada;
 * aqui é só o redirecionamento rápido de quem nem tem cookie.
 */
export function middleware(request: NextRequest) {
  const temSessao = request.cookies.has("qubit_sessao");
  if (request.nextUrl.pathname.startsWith("/painel") && !temSessao) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("proximo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
