"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  subscriptionId: string;
  initial: {
    priceRub: number;
    totalClasses: number;
    usedClasses: number;
    includesMaterials: boolean;
    includesMasterclass: boolean;
    notes: string | null;
    isActive: boolean;
  };
}

export function EditSubscriptionButton({ subscriptionId, initial }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    priceRub: String(initial.priceRub),
    totalClasses: String(initial.totalClasses),
    includesMaterials: initial.includesMaterials,
    includesMasterclass: initial.includesMasterclass,
    notes: initial.notes ?? "",
    isActive: initial.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }
  function toggle(field: "includesMaterials" | "includesMasterclass" | "isActive") {
    return () => setForm(p => ({ ...p, [field]: !p[field] }));
  }

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceRub: Number(form.priceRub),
          totalClasses: Number(form.totalClasses),
          includesMaterials: form.includesMaterials,
          includesMasterclass: form.includesMasterclass,
          notes: form.notes || null,
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
        <DialogHeader><DialogTitle>Редактировать абонемент</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Стоимость (₽)" type="number" min="0" value={form.priceRub} onChange={upd("priceRub")} />
            <Input label="Занятий всего" type="number" min="1" max="99" value={form.totalClasses} onChange={upd("totalClasses")} />
          </div>
          <p className="text-xs text-gray-400">Использовано: {initial.usedClasses} из {initial.totalClasses}</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.includesMaterials} onChange={toggle("includesMaterials")}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Включает материалы</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.includesMasterclass} onChange={toggle("includesMasterclass")}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Включает мастер-классы</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isActive} onChange={toggle("isActive")}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
              <span className="text-sm text-gray-700">Активный</span>
            </label>
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
