"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  bookingId: string;
  childName: string;
  hasSubscription: boolean;
}

export function AdminCancelBookingButton({ bookingId, childName, hasSubscription }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel(refund: boolean) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refund }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button
        onClick={() => { setError(""); setOpen(true); }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Отменить запись"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить запись — {childName}</DialogTitle>
            {hasSubscription ? (
              <DialogDescription>
                Запись оплачена абонементом. Выберите, что сделать с занятием.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Подтвердите отмену записи.
              </DialogDescription>
            )}
          </DialogHeader>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Назад
            </Button>
            {hasSubscription ? (
              <>
                <Button
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  onClick={() => handleCancel(false)}
                  disabled={loading}
                >
                  Отменить (занятие сгорает)
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCancel(true)}
                  loading={loading}
                >
                  Отменить + вернуть занятие
                </Button>
              </>
            ) : (
              <Button variant="destructive" onClick={() => handleCancel(false)} loading={loading}>
                Отменить запись
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
