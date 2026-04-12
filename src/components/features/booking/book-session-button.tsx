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
import type { Child, Subscription, ClassSession, Direction } from "@/types";

interface BookSessionButtonProps {
  session: ClassSession & { direction: Direction };
  children: Child[];
  subscriptions: Subscription[];
  bookedChildIds: string[];
}

export function BookSessionButton({
  session,
  children,
  subscriptions,
  bookedChildIds,
}: BookSessionButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [loading, setLoading] = useState(false);

  const availableChildren = children.filter((c) => !bookedChildIds.includes(c.id));
  const activeSubs = subscriptions.filter((s) => s.usedClasses < s.totalClasses);

  if (availableChildren.length === 0) return null;

  async function handleBook() {
    if (!selectedChild) return;
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classSessionId: session.id,
        childId: selectedChild,
        subscriptionId: selectedSub || null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      toast({ title: "Ошибка", description: data.error || "Не удалось записать", variant: "destructive" });
      return;
    }

    toast({ title: "Готово!", description: "Запись создана успешно", variant: "success" });
    setOpen(false);
    // Refresh
    window.location.reload();
  }

  const subTypeLabel: Record<string, string> = {
    DRAWING_ART_OWN: "Рисование/Арт (свои материалы)",
    DRAWING_ART_STUDIO: "Рисование/Арт (материалы студии)",
    CRAFT_CERAMIC: "Рукоделие/Керамика",
  };

  return (
    <>
      <Button size="sm" className="w-full" onClick={() => { setOpen(true); setSelectedChild(""); setSelectedSub(""); }}>
        Записаться
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Запись на занятие</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {session.direction.name}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Кого записываем</label>
              {availableChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    selectedChild === child.id
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>

            {activeSubs.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Оплата (абонемент)
                </label>
                <button
                  onClick={() => setSelectedSub("")}
                  className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                    selectedSub === ""
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Без абонемента (оплата на месте)
                </button>
                {activeSubs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSub(sub.id)}
                    className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                      selectedSub === sub.id
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{subTypeLabel[sub.type] || sub.type}</span>
                    <span className="text-gray-500 ml-2">
                      {sub.totalClasses - sub.usedClasses} занятий осталось
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleBook} loading={loading} disabled={!selectedChild}>
              Записать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
