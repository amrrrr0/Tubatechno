"use client";

import { useEffect, useRef } from "react";
import { getApiUrl } from "@/utils/api";

interface ViewCounterProps {
  id: number;
}

export default function ViewCounter({ id }: ViewCounterProps) {
  const incremented = useRef(false);

  useEffect(() => {
    if (incremented.current) return;
    incremented.current = true;

    fetch(getApiUrl(`/api/news/id/${id}/view`), {
      method: "POST",
    }).catch((err) => console.error("Error updating views:", err));
  }, [id]);

  return null;
}
