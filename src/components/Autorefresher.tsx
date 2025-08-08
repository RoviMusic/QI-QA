"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefresherProps {
  intervalMinutes: number;
}

export default function AutoRefresher({ intervalMinutes }: AutoRefresherProps) {
  const router = useRouter();

  useEffect(() => {
    const intervalInMs = intervalMinutes * 60 * 1000;
    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalInMs);

    return () => clearInterval(intervalId);
  }, [intervalMinutes, router]);

  return null;
}
