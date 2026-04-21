"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { STUDIO_TZ } from "@/lib/utils";

function todayStudio(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: STUDIO_TZ }).format(new Date());
}

function addDaysStr(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function DeleteSessionsButton() {
  const router = useRouter();

  const today    = todayStudio();
  const in4weeks = addDaysStr(today, 28);

  const [open, setOpen]       = useState(false);
  const [from, setFrom]       = useState(today);
  const [to, setTo]           = useState(in4weeks);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ deleted: number; skipped: number } | null>(null);
  const [error, setError]     = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleOpen() {
    setFrom(today);
    setTo(in4weeks);
    setResult(null);
    setError("");
    setConfirmed(false);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setResult(null);
    setError("");
    setConfirmed(false);
  }

  async function handleDelete() {
    if (!confirmed) { setConfirmed(true); return; }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/classes/bulk-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка"); return; }
      setResult(data);
      setConfirmed(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={handleOpen} className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
        <Trash2 className="h-4 w-4 mr-1" />
        Удалить занятия
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить занятия</DialogTitle>
            <DialogDescription>
              Удаляет занятия без активных записей. Занятия с записями учеников будут пропущены.
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <>
              <div className="grid grid-cols-2 gap-3 py-2">
                <Input label="С"  type="date" value={from} onChange={e => { setFrom(e.target.value); setConfirmed(false); }} />
                <Input label="По" type="date" value={to}   onChange={e => { setTo(e.target.value);   setConfirmed(false); }} />
              </div>

              {confirmed && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  Вы уверены? Это действие нельзя отменить. Нажмите ещё раз для подтверждения.
                </p>
              )}

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

              <DialogFooter>
                <Button variant="outline" onClick={handleClose} disabled={loading}>Отмена</Button>
                <Button
                  onClick={handleDelete}
                  loading={loading}
                  className={confirmed ? "bg-red-600 hover:bg-red-700 text-white" : ""}
                >
                  {confirmed ? "Подтвердить удаление" : "Удалить"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800 space-y-1">
                <p>Удалено занятий: <strong>{result.deleted}</strong></p>
                {result.skipped > 0 && (
                  <p className="text-amber-700">Пропущено (есть записи): <strong>{result.skipped}</strong></p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleClose}>Готово</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
