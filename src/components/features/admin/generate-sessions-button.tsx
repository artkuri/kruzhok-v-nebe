"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { fromZonedTime } from "date-fns-tz";
import { STUDIO_TZ } from "@/lib/utils";

interface Slot {
  id: string;
  dayOfWeek: number;   // 1=Mon … 7=Sun
  startTime: string;   // "HH:MM" — время в часовом поясе студии (UTC+5)
  durationMin: number;
  maxStudents: number;
  directionId: string;
  teacherId: string | null;
}

interface Props { slots: Slot[]; }

/** Текущая дата в часовом поясе студии, формат "YYYY-MM-DD" */
function todayStudio(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: STUDIO_TZ }).format(new Date());
}

/** Прибавляет n дней к строке "YYYY-MM-DD", работает через UTC (не зависит от браузерного TZ) */
function addDaysStr(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** ISO день недели (1=Пн … 7=Вс) для строки "YYYY-MM-DD" */
function isoWeekDay(dateStr: string): number {
  const day = new Date(dateStr + "T00:00:00Z").getUTCDay(); // 0=Вс
  return day === 0 ? 7 : day;
}

/** Первая дата >= fromStr с нужным днём недели */
function nextOccurrence(fromStr: string, isoDay: number): string {
  let str = fromStr;
  for (let i = 0; i < 7; i++) {
    if (isoWeekDay(str) === isoDay) return str;
    str = addDaysStr(str, 1);
  }
  return str;
}

export function GenerateSessionsButton({ slots }: Props) {
  const router = useRouter();

  const today     = todayStudio();
  const fourWeeks = addDaysStr(today, 28);

  const [open, setOpen]       = useState(false);
  const [from, setFrom]       = useState(today);
  const [to, setTo]           = useState(fourWeeks);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<{ created: number; skipped: number } | null>(null);
  const [error, setError]     = useState("");

  async function handleGenerate() {
    setError("");
    setResult(null);
    setLoading(true);

    if (from > to) { setError("Дата начала позже даты конца"); setLoading(false); return; }
    if (slots.length === 0) { setError("Нет активных слотов расписания"); setLoading(false); return; }

    let created = 0;
    let skipped = 0;

    for (const slot of slots) {
      let cur = nextOccurrence(from, slot.dayOfWeek);

      while (cur <= to) {
        // Время занятия всегда интерпретируется в часовом поясе студии (UTC+5)
        const sessionStart = fromZonedTime(`${cur}T${slot.startTime}:00`, STUDIO_TZ);
        const sessionEnd   = new Date(sessionStart.getTime() + slot.durationMin * 60_000);

        const res = await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scheduleSlotId: slot.id,
            date:           cur,                       // "YYYY-MM-DD" в зоне студии
            startTime:      sessionStart.toISOString(), // UTC ISO строка
            endTime:        sessionEnd.toISOString(),
            durationMin:    slot.durationMin,
            maxStudents:    slot.maxStudents,
            directionId:    slot.directionId,
            teacherId:      slot.teacherId,
          }),
        });

        if (res.status === 201) created++;
        else if (res.status === 200) skipped++;

        cur = addDaysStr(cur, 7);
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
                <Input label="С"  type="date" value={from} onChange={e => setFrom(e.target.value)} />
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
