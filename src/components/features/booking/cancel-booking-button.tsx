"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";

interface CancelBookingButtonProps {
  bookingId: string;
  canCancel: boolean; // true = >3h before session
}

export function CancelBookingButton({ bookingId, canCancel }: CancelBookingButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Ошибка");
      return;
    }

    const data = await res.json();

    let description: string;
    if (data.refunded) {
      description = "Занятие возвращено на абонемент";
    } else if (data.burned) {
      description = "Занятие сгорело — отмена менее чем за 3 часа";
    } else {
      description = "Запись отменена";
    }

    toast({
      title: "Запись отменена",
      description,
      variant: data.refunded ? "success" : "default",
    });

    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
        onClick={() => { setOpen(true); setError(""); }}
      >
        Отменить
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отмена записи</DialogTitle>
            <DialogDescription>
              {canCancel
                ? "Отмена за 3+ часа до занятия. Занятие вернётся на абонемент (если использовался)."
                : "Отмена менее чем за 3 часа до начала. Занятие из абонемента не вернётся."}
            </DialogDescription>
          </DialogHeader>

          {!canCancel && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-800">
              По правилам студии, занятие сгорает при отмене менее чем за 3 часа до начала.
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Назад
            </Button>
            <Button variant="destructive" onClick={handleCancel} loading={loading}>
              Подтвердить отмену
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
