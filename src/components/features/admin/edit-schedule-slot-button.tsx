"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Teacher { id: string; user: { name: string }; }

interface Slot {
  id: string;
  startTime: string;
  durationMin: number;
  maxStudents: number;
  isActive: boolean;
  teacherId: string | null;
}

interface Props { slot: Slot; teachers: Teacher[]; }

export function EditScheduleSlotButton({ slot, teachers }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncInfo, setSyncInfo] = useState<string | null>(null);

  const [form, setForm] = useState({
    startTime:   slot.startTime,
    durationMin: String(slot.durationMin),
    maxStudents: String(slot.maxStudents),
    isActive:    slot.isActive,
    teacherId:   slot.teacherId ?? "__none__",
  });

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    setSyncInfo(null);
    setLoading(true);
    try {
      const timeChanged =
        form.startTime !== slot.startTime ||
        Number(form.durationMin) !== slot.durationMin;

      const res = await fetch(`/api/schedule-slots/${slot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime:   form.startTime,
          durationMin: Number(form.durationMin),
          maxStudents: Number(form.maxStudents),
          isActive:    form.isActive,
          teacherId:   form.teacherId === "__none__" ? null : form.teacherId || null,
          // Всегда используем часовой пояс студии (UTC+5, Екатеринбург)
          ...(timeChanged && {
            timezone: "Asia/Yekaterinburg",
          }),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      const result = await res.json();
      if (result.updatedSessions > 0) {
        setSyncInfo(`Обновлено будущих занятий: ${result.updatedSessions}`);
        setTimeout(() => { setOpen(false); router.refresh(); }, 1500);
      } else {
        setOpen(false);
        router.refresh();
      }
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <button
        onClick={() => { setError(""); setOpen(true); }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Редактировать слот</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Время начала" type="time" value={form.startTime} onChange={upd("startTime")} />
              <Input label="Длительность (мин)" type="number" min="15" value={form.durationMin} onChange={upd("durationMin")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Макс. учеников" type="number" min="1" value={form.maxStudents} onChange={upd("maxStudents")} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Статус</label>
                <Select value={form.isActive ? "1" : "0"} onValueChange={(v) => setForm(p => ({ ...p, isActive: v === "1" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Активен</SelectItem>
                    <SelectItem value="0">Пауза</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Педагог</label>
              <Select value={form.teacherId} onValueChange={(v) => setForm(p => ({ ...p, teacherId: v }))}>
                <SelectTrigger><SelectValue placeholder="Не назначен" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Не назначен</SelectItem>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error    && <p className="text-sm text-red-600   bg-red-50   rounded-xl px-3 py-2">{error}</p>}
            {syncInfo && <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-3 py-2">{syncInfo}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
            <Button onClick={handleSave} loading={loading}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
