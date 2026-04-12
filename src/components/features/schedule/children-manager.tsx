"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { Plus, User, Trash2, Edit } from "lucide-react";
import type { Child } from "@/types";

interface ChildrenManagerProps {
  initialChildren: (Child & { _count: { bookings: number } })[];
}

export function ChildrenManager({ initialChildren }: ChildrenManagerProps) {
  const [children, setChildren] = useState(initialChildren);
  const [addOpen, setAddOpen] = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [form, setForm] = useState({ name: "", birthDate: "", notes: "" });
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setForm({ name: "", birthDate: "", notes: "" });
  }

  async function handleAdd() {
    if (!form.name) return;
    setLoading(true);

    const res = await fetch("/api/children", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      return;
    }

    const child = await res.json();
    setChildren((prev) => [...prev, { ...child, _count: { bookings: 0 } }]);
    toast({ title: "Ребёнок добавлен", variant: "success" });
    setAddOpen(false);
    resetForm();
  }

  async function handleEdit() {
    if (!editChild || !form.name) return;
    setLoading(true);

    const res = await fetch(`/api/children/${editChild.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      return;
    }

    const updated = await res.json();
    setChildren((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    toast({ title: "Данные обновлены", variant: "success" });
    setEditChild(null);
    resetForm();
  }

  async function handleDelete(child: Child & { _count: { bookings: number } }) {
    if (child._count.bookings > 0) {
      toast({
        title: "Нельзя удалить",
        description: "У ребёнка есть активные записи на занятия",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Удалить ${child.name}?`)) return;

    const res = await fetch(`/api/children/${child.id}`, { method: "DELETE" });
    if (res.ok) {
      setChildren((prev) => prev.filter((c) => c.id !== child.id));
      toast({ title: "Ребёнок удалён", variant: "default" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Мои дети</h1>
          <p className="text-gray-500 mt-1">Управляйте профилями детей для записи на занятия</p>
        </div>
        <Button onClick={() => { setAddOpen(true); resetForm(); }}>
          <Plus className="h-4 w-4" />
          Добавить ребёнка
        </Button>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <User className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Ещё не добавлено детей</p>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" />
            Добавить ребёнка
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <div key={child.id} className="rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                    {child.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{child.name}</p>
                    {child.birthDate && (
                      <p className="text-sm text-gray-500">
                        {new Date(child.birthDate).toLocaleDateString("ru-RU")}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">{child._count.bookings} записей</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setEditChild(child);
                      setForm({
                        name: child.name,
                        birthDate: child.birthDate
                          ? new Date(child.birthDate).toISOString().split("T")[0]
                          : "",
                        notes: child.notes || "",
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                    onClick={() => handleDelete(child)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {child.notes && <p className="text-sm text-gray-500 mt-3 border-t pt-3">{child.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить ребёнка</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              label="Имя и фамилия"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Соня Иванова"
              required
            />
            <Input
              label="Дата рождения"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Заметки</label>
              <textarea
                className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Аллергии, особенности, пожелания..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Отмена</Button>
            <Button onClick={handleAdd} loading={loading} disabled={!form.name}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editChild} onOpenChange={(o) => !o && setEditChild(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              label="Имя и фамилия"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Дата рождения"
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Заметки</label>
              <textarea
                className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditChild(null)}>Отмена</Button>
            <Button onClick={handleEdit} loading={loading}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
