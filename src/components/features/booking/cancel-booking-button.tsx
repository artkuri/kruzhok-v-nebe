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
  canCancel: boolean;
}

export function CancelBookingButton({ bookingId, canCancel }: CancelBookingButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Отменено клиентом" }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      return;
    }

    const data = await res.json();
    toast({
      title: "Запись отменена",
      description: data.refunded
        ? "Занятие возвращено на абонемент"
        : canCancel
        ? "Занятие возвращено"
        : "Занятие сгорело (отмена менее чем за 3 часа)",
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
        onClick={() => setOpen(true)}
      >
        Отменить
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отмена записи</DialogTitle>
            <DialogDescription>
              {canCancel
                ? "Вы отменяете запись более чем за 3 часа до занятия. Занятие будет возвращено на абонемент (если использовался)."
                : "Внимание: отмена менее чем за 3 часа до начала. Занятие из абонемента не вернётся."}
            </DialogDescription>
          </DialogHeader>
          {!canCancel && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-sm text-amber-800">
              Занятие сгорает при отмене позже чем за 3 часа до начала.
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Назад
            </Button>
            <Button variant="destructive" onClick={handleCancel} loading={loading}>
              Отменить запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
