"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  familyId: string;
  familyName: string;
}

export function AddChildButton({ familyId, familyName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", birthDate: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) { setError("Имя обязательно"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/families/${familyId}/children`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          birthDate: form.birthDate || null,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      setForm({ name: "", birthDate: "", notes: "" });
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-1" />
          Добавить ребёнка
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить ребёнка в семью «{familyName}»</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input label="Имя *" value={form.name} onChange={upd("name")} placeholder="Анна" />
          <Input label="Дата рождения" type="date" value={form.birthDate} onChange={upd("birthDate")} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Заметки</label>
            <textarea value={form.notes} onChange={upd("notes")} rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
          <Button onClick={handleSave} loading={loading}>Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
