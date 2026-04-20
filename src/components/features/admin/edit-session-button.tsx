"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { format, fromZonedTime } from "date-fns-tz";
import { STUDIO_TZ } from "@/lib/utils";

interface Props {
  sessionId: string;
  initial: {
    startTime: string; // ISO UTC
    endTime: string;   // ISO UTC
    maxStudents: number;
    durationMin: number;
    notes: string | null;
  };
  isStarted: boolean;
}

/** UTC ISO → "YYYY-MM-DDTHH:mm" в часовом поясе студии (для datetime-local input) */
function toStudioInput(iso: string) {
  return format(new Date(iso), "yyyy-MM-dd'T'HH:mm", { timeZone: STUDIO_TZ });
}

export function EditSessionButton({ sessionId, initial, isStarted }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    startTime: toStudioInput(initial.startTime),
    endTime: toStudioInput(initial.endTime),
    maxStudents: String(initial.maxStudents),
    durationMin: String(initial.durationMin),
    notes: initial.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/classes/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: fromZonedTime(form.startTime, STUDIO_TZ).toISOString(),
          endTime:   fromZonedTime(form.endTime,   STUDIO_TZ).toISOString(),
          maxStudents: Number(form.maxStudents),
          durationMin: Number(form.durationMin),
          notes: form.notes || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  if (isStarted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5 mr-1" />Изменить</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Редактировать занятие</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <Input label="Начало" type="datetime-local" value={form.startTime} onChange={upd("startTime")} />
          <Input label="Конец" type="datetime-local" value={form.endTime} onChange={upd("endTime")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Макс. учеников" type="number" min="1" max="100" value={form.maxStudents} onChange={upd("maxStudents")} />
            <Input label="Длительность (мин)" type="number" min="15" value={form.durationMin} onChange={upd("durationMin")} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Заметки</label>
            <textarea value={form.notes} onChange={upd("notes")} rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
          <Button onClick={handleSave} loading={loading}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
