"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await createSupabaseBrowser().auth.signOut();
        router.push("/entrar");
        router.refresh();
      }}
    >
      Sair
    </Button>
  );
}
