"use client";

import { useEffect, useState } from "react";
import type { Partner } from "@/content/partners";

/** Parceiros em órbita para as camadas 3D (client-side). */
export function useOrbitPartners(): Partner[] {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/orbita")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => alive && Array.isArray(data) && setPartners(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return partners;
}
