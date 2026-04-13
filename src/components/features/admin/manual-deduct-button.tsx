"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  bookingId: string;
  childName: string;
  subscriptionId: string;
  subscriptionLabel: string;
}

export function ManualDeductButton({ bookingId, childName, subscriptionId, subscriptionLabel }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDeduct() {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          attended: false,
          deductFromSubscription: { subscriptionId },
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
          title="Списать занятие с абонемента"
        >
          <MinusCircle className="h-3.5 w-3.5" />
          Списать
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Списать занятие?</DialogTitle></DialogHeader>
        <div className="py-2 space-y-2">
          <p className="text-sm text-gray-600">
            Занятие будет списано с абонемента{" "}
            <strong>«{subscriptionLabel}»</strong> ребёнка{" "}
            <strong>{childName}</strong>.
          </p>
          <p className="text-xs text-gray-400">
            Это действие нельзя отменить автоматически.
          </p>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
          <Button variant="destructive" onClick={handleDeduct} loading={loading}>Списать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
