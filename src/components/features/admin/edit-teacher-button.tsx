"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  teacherId: string;
  initial: {
    name: string;
    phone: string | null;
    bio: string | null;
  };
}

export function EditTeacherButton({ teacherId, initial }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: initial.name,
    phone: initial.phone ?? "",
    bio: initial.bio ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSave() {
    setError("");
    if (!form.name.trim()) {
      setError("Имя обязательно");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/teachers/${teacherId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          bio: form.bio.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Ошибка сохранения");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Pencil className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать педагога</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            label="Имя"
            value={form.name}
            onChange={update("name")}
            placeholder="Елена Смирнова"
            required
          />
          <Input
            label="Телефон"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+7 900 000-00-00"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">О педагоге</label>
            <textarea
              value={form.bio}
              onChange={update("bio")}
              placeholder="Краткое описание..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 rounded-xl bg-red-50 px-3 py-2">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
