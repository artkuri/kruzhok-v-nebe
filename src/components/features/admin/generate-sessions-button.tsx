"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

interface Slot {
  id: string;
  dayOfWeek: number;   // 1=Mon … 7=Sun
  startTime: string;   // "HH:MM" local time
  durationMin: number;
  maxStudents: number;
  directionId: string;
  teacherId: string | null;
}

interface Props { slots: Slot[]; }

// ISO week day → JS getDay() (0=Sun, 1=Mon … 6=Sat)
const ISO_TO_JS: Record<number, number> = { 1:1,2:2,3:3,4:4,5:5,6:6,7:0 };

function nextOccurrence(fromDate: Date, isoDay: number): Date {
  const jsDay = ISO_TO_JS[isoDay];
  const d = new Date(fromDate);
  d.setHours(0,0,0,0);
  const diff = (jsDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

export function GenerateSessionsButton({ slots }: Props) {
  const router = useRouter();
  const today = new Date();
  const fourWeeks = new Date(today);
  fourWeeks.setDate(today.getDate() + 28);

  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(fmt(today));
  const [to, setTo]   = useState(fmt(fourWeeks));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setResult(null);
    setLoading(true);

    const start = new Date(from + "T00:00:00");
    const end   = new Date(to   + "T23:59:59");

    if (start > end) { setError("Дата начала позже даты конца"); setLoading(false); return; }
    if (slots.length === 0) { setError("Нет активных слотов расписания"); setLoading(false); return; }

    let created = 0;
    let skipped = 0;

    for (const slot of slots) {
      let cur = nextOccurrence(start, slot.dayOfWeek);

      while (cur <= end) {
        // Build startTime in local timezone, then convert to UTC via toISOString
        const [hh, mm] = slot.startTime.split(":").map(Number);
        const sessionStart = new Date(cur);
        sessionStart.setHours(hh, mm, 0, 0);
        const sessionEnd = new Date(sessionStart.getTime() + slot.durationMin * 60_000);

        // Use local date parts to avoid UTC-offset shifting the date
        const localDate = [
          cur.getFullYear(),
          String(cur.getMonth() + 1).padStart(2, "0"),
          String(cur.getDate()).padStart(2, "0"),
        ].join("-");

        const res = await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scheduleSlotId: slot.id,
            date:           localDate,
            startTime:      sessionStart.toISOString(),
            endTime:        sessionEnd.toISOString(),
            durationMin:    slot.durationMin,
            maxStudents:    slot.maxStudents,
            directionId:    slot.directionId,
            teacherId:      slot.teacherId,
          }),
        });

        if (res.status === 201) created++;
        else if (res.status === 200) skipped++; // already exists
        else { /* ignore individual errors */ }

        cur.setDate(cur.getDate() + 7);
      }
    }

    setLoading(false);
    setResult({ created, skipped });
    router.refresh();
  }

  function handleClose() {
    setOpen(false);
    setResult(null);
    setError("");
  }

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <CalendarRange className="h-4 w-4 mr-1" />
        Сгенерировать занятия
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сгенерировать занятия из расписания</DialogTitle>
            <DialogDescription>
              Занятия создадутся по всем активным слотам расписания ({slots.length} шт.) за выбранный период.
              Уже существующие занятия пропускаются.
            </DialogDescription>
          </DialogHeader>

          {!result ? (
            <>
              <div className="grid grid-cols-2 gap-3 py-2">
                <Input label="С" type="date" value={from} onChange={e => setFrom(e.target.value)} />
                <Input label="По" type="date" value={to}   onChange={e => setTo(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={handleClose} disabled={loading}>Отмена</Button>
                <Button onClick={handleGenerate} loading={loading}>Сгенерировать</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800 space-y-1">
                <p>Создано занятий: <strong>{result.created}</strong></p>
                <p>Уже существовали: <strong>{result.skipped}</strong></p>
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
