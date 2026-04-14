"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

interface ChildRow { name: string; birthDate: string; }

export function CreateClientButton() {
  const router = useRouter();
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState<{ familyId: string; pw?: string } | null>(null);

  const [form, setForm] = useState({
    name:       "",
    phone:      "",
    email:      "",
    familyName: "",
    password:   "",
  });
  const [children, setChildren] = useState<ChildRow[]>([]);

  function resetAll() {
    setForm({ name: "", phone: "", email: "", familyName: "", password: "" });
    setChildren([]);
    setError("");
    setDone(null);
  }

  function updForm(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(p => ({ ...p, [field]: e.target.value }));
  }

  function addChild() {
    setChildren(p => [...p, { name: "", birthDate: "" }]);
  }

  function updChild(i: number, field: keyof ChildRow) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setChildren(p => p.map((c, idx) => idx === i ? { ...c, [field]: e.target.value } : c));
  }

  function removeChild(i: number) {
    setChildren(p => p.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) { setError("Укажите имя родителя"); return; }
    if (!form.phone.trim() && !form.email.trim()) {
      setError("Укажите телефон или email"); return;
    }
    for (const c of children) {
      if (!c.name.trim()) { setError("Укажите имя для каждого ребёнка"); return; }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       form.name,
          phone:      form.phone || null,
          email:      form.email || null,
          familyName: form.familyName || null,
          password:   form.password || undefined,
          children:   children.map(c => ({
            name:      c.name,
            birthDate: c.birthDate || null,
          })),
        }),
      });

      const d = await res.json();
      if (!res.ok) { setError(d.error || "Ошибка"); return; }

      setDone({ familyId: d.familyId, pw: d.generatedPw });
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Button size="sm" onClick={() => { resetAll(); setOpen(true); }}>
        <Plus className="h-4 w-4 mr-1" />
        Добавить клиента
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetAll(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Новый клиент</DialogTitle>
          </DialogHeader>

          {done ? (
            <div className="py-4 space-y-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-800">
                Клиент создан успешно.
                {done.pw && (
                  <p className="mt-1">
                    Временный пароль для входа: <strong className="font-mono">{done.pw}</strong>
                    <br />
                    <span className="text-xs text-emerald-600">Передайте клиенту и попросите сменить.</span>
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => { setOpen(false); resetAll(); }}>Готово</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 py-2 max-h-[70vh] overflow-y-auto pr-1">
              <Input label="Имя родителя *" value={form.name} onChange={updForm("name")} placeholder="Мария Иванова" />
              <Input label="Телефон" value={form.phone} onChange={updForm("phone")} placeholder="+7 900 000-00-00" />
              <Input label="Email" type="email" value={form.email} onChange={updForm("email")} placeholder="maria@example.com" />
              <Input label="Название семьи" value={form.familyName} onChange={updForm("familyName")} placeholder="Семья Ивановых" />
              <Input label="Пароль для входа" value={form.password} onChange={updForm("password")} placeholder="Оставьте пустым для авто-генерации" />

              {/* Children */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Дети</label>
                  <button type="button" onClick={addChild}
                    className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                    <UserPlus className="h-3.5 w-3.5" />
                    Добавить
                  </button>
                </div>
                {children.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                    <Input label={i === 0 ? "Имя" : undefined} value={c.name}
                      onChange={updChild(i, "name")} placeholder="Имя ребёнка" />
                    <div className="space-y-1.5">
                      {i === 0 && <label className="text-sm font-medium text-gray-700">Дата рождения</label>}
                      <input type="date" value={c.birthDate} onChange={updChild(i, "birthDate")}
                        className="h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                    <button type="button" onClick={() => removeChild(i)}
                      className={`p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ${i === 0 ? "mt-5" : ""}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {children.length === 0 && (
                  <p className="text-xs text-gray-400">Можно добавить позже через карточку клиента</p>
                )}
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Отмена</Button>
                <Button onClick={handleSave} loading={loading}>Создать</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
