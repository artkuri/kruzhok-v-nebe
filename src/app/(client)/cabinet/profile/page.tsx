"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
      });
    }
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
      return;
    }

    await update({ name: form.name });
    toast({ title: "Профиль обновлён", variant: "success" });
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={session?.user?.email || ""}
            disabled
            hint="Email нельзя изменить"
          />
          <Input
            label="Телефон"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+7 900 000-00-00"
          />
          <Button type="submit" loading={loading}>Сохранить</Button>
        </form>
      </div>
    </div>
  );
}
