"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Direction { id: string; name: string; color: string; }
interface Teacher   { id: string; user: { name: string }; }

const DAY_NAMES = ["", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

interface Props { directions: Direction[]; teachers: Teacher[]; }

export function CreateScheduleSlotButton({ directions, teachers }: Props) {
  const router = useRouter();
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const [form, setForm] = useState({
    directionId: "",
    dayOfWeek:   "1",
    startTime:   "10:00",
    durationMin: "60",
    maxStudents: "10",
    teacherId:   "__none__",
  });

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    if (!form.directionId) { setError("Выберите направление"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/schedule-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directionId: form.directionId,
          dayOfWeek:   Number(form.dayOfWeek),
          startTime:   form.startTime,
          durationMin: Number(form.durationMin),
          maxStudents: Number(form.maxStudents),
          teacherId:   form.teacherId === "__none__" ? null : form.teacherId || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Button size="sm" onClick={() => { setError(""); setOpen(true); }}>
        <Plus className="h-4 w-4 mr-1" />
        Добавить слот
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Новый слот расписания</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Направление</label>
              <Select value={form.directionId} onValueChange={(v) => setForm(p => ({ ...p, directionId: v }))}>
                <SelectTrigger><SelectValue placeholder="Выберите..." /></SelectTrigger>
                <SelectContent>
                  {directions.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">День недели</label>
                <Select value={form.dayOfWeek} onValueChange={(v) => setForm(p => ({ ...p, dayOfWeek: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7].map(d => (
                      <SelectItem key={d} value={String(d)}>{DAY_NAMES[d]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input label="Время начала" type="time" value={form.startTime} onChange={upd("startTime")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input label="Длительность (мин)" type="number" min="15" value={form.durationMin} onChange={upd("durationMin")} />
              <Input label="Макс. учеников" type="number" min="1" value={form.maxStudents} onChange={upd("maxStudents")} />
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

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
            <Button onClick={handleSave} loading={loading}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
