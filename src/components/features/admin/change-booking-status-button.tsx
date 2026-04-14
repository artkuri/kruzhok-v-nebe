"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  bookingId: string;
  currentStatus: string;
}

export function ChangeBookingStatusButton({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (currentStatus !== "PENDING" && currentStatus !== "CONFIRMED") return null;

  const next = currentStatus === "PENDING" ? "CONFIRMED" : "PENDING";
  const label = currentStatus === "PENDING" ? "Подтвердить" : "Снять";

  async function handleChange() {
    setLoading(true);
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-xs"
      onClick={handleChange}
      disabled={loading}
    >
      <CheckCircle className="h-3 w-3 mr-1" />
      {label}
    </Button>
  );
}
