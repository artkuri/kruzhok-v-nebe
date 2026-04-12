"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toaster";
import { Plus } from "lucide-react";
import type { Family, Child } from "@/types";

interface AdminBookingCreatorProps {
  sessionId: string;
  families: (Family & { children: Child[] })[];
  bookedChildIds: string[];
}

export function AdminBookingCreator({ sessionId, families, bookedChildIds }: AdminBookingCreatorProps) {
  const [open, setOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(false);

  const familyChildren = families.find((f) => f.id === selectedFamily)?.children || [];
  const availableChildren = familyChildren.filter((c) => !bookedChildIds.includes(c.id));

  async function handleCreate() {
    if (!selectedChild) return;
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classSessionId: sessionId, childId: selectedChild }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      return;
    }

    toast({ title: "Запись создана", variant: "success" });
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Plus className="h-4 w-4" />
        Добавить запись вручную
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать запись</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Семья</label>
              {families.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setSelectedFamily(f.id); setSelectedChild(""); }}
                  className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    selectedFamily === f.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {f.name}
                  <span className="text-gray-400 ml-2">({f.children.length} детей)</span>
                </button>
              ))}
            </div>

            {selectedFamily && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ребёнок</label>
                {availableChildren.length === 0 ? (
                  <p className="text-sm text-gray-400">Все дети этой семьи уже записаны</p>
                ) : (
                  availableChildren.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedChild(c.id)}
                      className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                        selectedChild === c.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate} loading={loading} disabled={!selectedChild}>
              Создать запись
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
