"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export function CreateTeacherButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", bio: "", password: "teacher123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Имя и email обязательны"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || null, bio: form.bio || null, password: form.password }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || "Ошибка"); return; }
      setOpen(false);
      setForm({ name: "", email: "", phone: "", bio: "", password: "teacher123" });
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Добавить педагога</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Новый педагог</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <Input label="Имя *" value={form.name} onChange={update("name")} placeholder="Елена Смирнова" />
          <Input label="Email *" type="email" value={form.email} onChange={update("email")} placeholder="elena@kruzhok.ru" />
          <Input label="Телефон" value={form.phone} onChange={update("phone")} placeholder="+7 900 000-00-00" />
          <Input label="Пароль для входа" value={form.password} onChange={update("password")} placeholder="Минимум 6 символов" />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">О педагоге</label>
            <textarea value={form.bio} onChange={update("bio")} placeholder="Краткое описание..." rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
          <Button onClick={handleSave} loading={loading}>Создать</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
