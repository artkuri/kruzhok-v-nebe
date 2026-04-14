"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface Props { slotId: string; label: string; }

export function DeleteScheduleSlotButton({ slotId, label }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule-slots/${slotId}`, { method: "DELETE" });
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
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить слот расписания</DialogTitle>
            <DialogDescription>
              Слот <strong>{label}</strong> будет удалён. Уже созданные занятия останутся.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
            <Button variant="destructive" onClick={handleDelete} loading={loading}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
