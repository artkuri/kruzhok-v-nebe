"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  sessionId: string;
}

export function CancelSessionButton({ sessionId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/classes/${sessionId}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setError(""); setOpen(true); }}>
        <Ban className="h-3.5 w-3.5 mr-1" />
        Отменить занятие
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить занятие?</DialogTitle>
            <DialogDescription>
              Занятие будет помечено как отменённое. Все записи учеников сохранятся в истории.
              Действие можно отменить вручную, изменив статус.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Назад</Button>
            <Button variant="destructive" onClick={handleCancel} loading={loading}>
              Да, отменить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
