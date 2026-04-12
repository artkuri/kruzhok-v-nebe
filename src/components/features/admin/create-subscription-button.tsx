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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toaster";
import { Plus } from "lucide-react";
import type { Family } from "@/types";

const PRICES: Record<string, number> = {
  DRAWING_ART_OWN: 3600,
  DRAWING_ART_STUDIO: 4800,
  CRAFT_CERAMIC: 4800,
};

const TYPE_LABELS: Record<string, string> = {
  DRAWING_ART_OWN: "Рисование / Арт-терапия (свои матер.) — 3 600 ₽",
  DRAWING_ART_STUDIO: "Рисование / Арт-терапия (матер. студии) — 4 800 ₽",
  CRAFT_CERAMIC: "Рукоделие / Керамика — 4 800 ₽",
};

interface CreateSubscriptionButtonProps {
  families: Family[];
}

export function CreateSubscriptionButton({ families }: CreateSubscriptionButtonProps) {
  const [open, setOpen] = useState(false);
  const [familyId, setFamilyId] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!familyId || !type) return;
    setLoading(true);

    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ familyId, type, priceRub: PRICES[type] || 4800 }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error, variant: "destructive" });
      return;
    }

    toast({ title: "Абонемент создан", variant: "success" });
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Продать абонемент
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать абонемент</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Семья</label>
              <Select onValueChange={setFamilyId} value={familyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите семью" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Тип абонемента</label>
              <Select onValueChange={setType} value={type}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              8 занятий · Семейный · Действует 1 год
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={handleCreate} loading={loading} disabled={!familyId || !type}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
