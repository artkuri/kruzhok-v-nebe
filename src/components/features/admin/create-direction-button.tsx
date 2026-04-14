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

const TYPES = [
  { value: "DRAWING",      label: "Рисование" },
  { value: "ART_THERAPY",  label: "Арт-терапия" },
  { value: "CERAMICS",     label: "Керамика" },
  { value: "MASTERCLASS",  label: "Мастер-класс" },
  { value: "INDIVIDUAL",   label: "Индивидуальное" },
];

export function CreateDirectionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type:        "DRAWING",
    name:        "",
    description: "",
    ageGroup:    "",
    priceRub:    "",
    color:       "#6366f1",
  });

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) { setError("Введите название"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/directions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:        form.type,
          name:        form.name.trim(),
          description: form.description || null,
          ageGroup:    form.ageGroup || null,
          priceRub:    form.priceRub !== "" ? Number(form.priceRub) : null,
          color:       form.color,
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
        Добавить направление
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Новое направление</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Тип</label>
              <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Input label="Название" value={form.name} onChange={upd("name")} placeholder="Рисование акварелью" />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Возрастная группа" value={form.ageGroup} onChange={upd("ageGroup")} placeholder="3–7, 8+, все" />
              <Input label="Цена разового (₽)" type="number" min="0" value={form.priceRub} onChange={upd("priceRub")} placeholder="0" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Описание</label>
              <textarea value={form.description} onChange={upd("description")} rows={2}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Цвет</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={upd("color")}
                  className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500">{form.color}</span>
              </div>
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
