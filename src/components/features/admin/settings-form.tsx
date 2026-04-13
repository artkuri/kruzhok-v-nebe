"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Settings {
  studioName: string;
  address: string | null;
  phone: string | null;
  description: string | null;
  maxGroupSize: number;
  cancellationHours: number;
  defaultDurationMin: number;
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState({
    studioName: initial.studioName,
    address: initial.address ?? "",
    phone: initial.phone ?? "",
    description: initial.description ?? "",
    maxGroupSize: String(initial.maxGroupSize),
    cancellationHours: String(initial.cancellationHours),
    defaultDurationMin: String(initial.defaultDurationMin),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function upd(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [field]: e.target.value }));
      setSaved(false);
    };
  }

  async function handleSave() {
    setError("");
    setSaved(false);
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studioName: form.studioName,
          address: form.address || null,
          phone: form.phone || null,
          description: form.description || null,
          maxGroupSize: Number(form.maxGroupSize),
          cancellationHours: Number(form.cancellationHours),
          defaultDurationMin: Number(form.defaultDurationMin),
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setSaved(true);
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Студия</h2>
        <div className="grid gap-3">
          <Input label="Название студии" value={form.studioName} onChange={upd("studioName")} />
          <Input label="Адрес" value={form.address} onChange={upd("address")} placeholder="г. Уфа, ул. Примерная, 1" />
          <Input label="Телефон" value={form.phone} onChange={upd("phone")} placeholder="+7 (347) 000-00-00" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">О студии</label>
            <textarea value={form.description} onChange={upd("description")} rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="Краткое описание для сайта..." />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Параметры занятий</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Input label="Макс. в группе" type="number" min="1" max="30" value={form.maxGroupSize} onChange={upd("maxGroupSize")} />
          <Input label="Отмена (часов до)" type="number" min="0" max="72" value={form.cancellationHours} onChange={upd("cancellationHours")} />
          <Input label="Длительность по умолч. (мин)" type="number" min="15" value={form.defaultDurationMin} onChange={upd("defaultDurationMin")} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      {saved && <p className="text-sm text-emerald-600 bg-emerald-50 rounded-xl px-3 py-2">Настройки сохранены</p>}

      <Button onClick={handleSave} loading={loading}>Сохранить изменения</Button>
    </div>
  );
}
