"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  directionId: string;
  initial: {
    name: string;
    description: string | null;
    ageGroup: string | null;
    priceRub: number | null;
    color: string;
    isActive: boolean;
  };
}

export function EditDirectionPriceButton({ directionId, initial }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: initial.name,
    description: initial.description ?? "",
    ageGroup: initial.ageGroup ?? "",
    priceRub: initial.priceRub != null ? String(initial.priceRub) : "",
    color: initial.color,
    isActive: initial.isActive,
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
      const res = await fetch(`/api/directions/${directionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          ageGroup: form.ageGroup || null,
          priceRub: form.priceRub !== "" ? Number(form.priceRub) : null,
          color: form.color,
          isActive: form.isActive,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
          <Pencil className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Редактировать направление</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <Input label="Название" value={form.name} onChange={upd("name")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Возрастная группа" value={form.ageGroup} onChange={upd("ageGroup")} placeholder="3–7, 8+, все" />
            <Input label="Цена разового (₽)" type="number" min="0" value={form.priceRub} onChange={upd("priceRub")} placeholder="0" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea value={form.description} onChange={upd("description")} rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          <div className="flex items-center gap-3">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-gray-700">Цвет</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={upd("color")}
                  className="h-9 w-14 rounded-lg border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500">{form.color}</span>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none mt-5">
              <input type="checkbox" checked={form.isActive}
                onChange={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Активно</span>
            </label>
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
