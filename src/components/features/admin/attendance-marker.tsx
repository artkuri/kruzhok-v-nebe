"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { Check, X } from "lucide-react";
import type { Attendance } from "@/types";

interface AttendanceMarkerProps {
  bookingId: string;
  currentAttendance: Attendance | null;
  sessionStarted: boolean;
}

export function AttendanceMarker({
  bookingId,
  currentAttendance,
  sessionStarted,
}: AttendanceMarkerProps) {
  const [attendance, setAttendance] = useState(currentAttendance);
  const [loading, setLoading] = useState(false);

  async function mark(attended: boolean) {
    setLoading(true);
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, attended }),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setAttendance(data);
      toast({
        title: attended ? "Отмечено: присутствовал" : "Отмечено: не пришёл",
        variant: attended ? "success" : "default",
      });
    } else {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  }

  if (attendance) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            attendance.attended
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {attendance.attended ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
          {attendance.attended ? "Пришёл" : "Не пришёл"}
        </span>
        {/* Allow re-mark */}
        <button
          className="text-xs text-gray-400 hover:text-gray-600"
          onClick={() => setAttendance(null)}
        >
          изм.
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      <Button
        size="sm"
        variant="outline"
        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-2.5"
        loading={loading}
        onClick={() => mark(true)}
        title="Присутствовал"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-200 text-red-600 hover:bg-red-50 px-2.5"
        loading={loading}
        onClick={() => mark(false)}
        title="Не пришёл"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
