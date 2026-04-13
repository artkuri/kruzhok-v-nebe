"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Props { teacherId: string; teacherName: string; }

export function DeleteTeacherButton({ teacherId, teacherName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/teachers/${teacherId}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Удалить педагога?</DialogTitle></DialogHeader>
        <p className="text-sm text-gray-600 py-2">
          Педагог <strong>{teacherName}</strong> будет удалён. Он будет снят с будущих занятий.
          Прошедшие занятия сохранятся.
        </p>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
          <Button variant="destructive" onClick={handleDelete} loading={loading}>Удалить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
