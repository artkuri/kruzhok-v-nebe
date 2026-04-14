"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Family { id: string; name: string; }

interface PaymentTarget {
  bookings: {
    id: string;
    child: { name: string };
    classSession: { startTime: string; direction: { name: string } };
  }[];
  subscriptions: {
    id: string;
    type: string;
    totalClasses: number;
    usedClasses: number;
    priceRub: number;
  }[];
}

const SUB_LABELS: Record<string, string> = {
  DRAWING_ART_OWN:    "Рисование/Арт (свои матер.)",
  DRAWING_ART_STUDIO: "Рисование/Арт (студия)",
  CRAFT_CERAMIC:      "Рукоделие/Керамика",
};

const METHOD_LABELS: Record<string, string> = {
  CASH:     "Наличные",
  TRANSFER: "Перевод",
  ON_SITE:  "На месте",
};

export function AddPaymentButton({ families }: { families: Family[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"family" | "details">("family");

  const [familyId, setFamilyId]     = useState("");
  const [targets, setTargets]       = useState<PaymentTarget | null>(null);
  const [loadingTargets, setLoadingTargets] = useState(false);

  const [kind, setKind]             = useState<"booking" | "subscription" | "misc">("misc");
  const [bookingId, setBookingId]   = useState("");
  const [subscriptionId, setSubId]  = useState("");
  const [amount, setAmount]         = useState("");
  const [method, setMethod]         = useState("CASH");
  const [notes, setNotes]           = useState("");
  const [isPaid, setIsPaid]         = useState(true);

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  function reset() {
    setStep("family"); setFamilyId(""); setTargets(null);
    setKind("misc"); setBookingId(""); setSubId("");
    setAmount(""); setMethod("CASH"); setNotes("");
    setIsPaid(true); setError("");
  }

  async function loadTargets(fid: string) {
    setLoadingTargets(true);
    try {
      const res = await fetch(`/api/admin/families/${fid}/payment-targets`);
      const data = await res.json();
      setTargets(data);
    } catch { /* non-critical */ }
    finally { setLoadingTargets(false); }
  }

  function handleFamilyNext() {
    if (!familyId) { setError("Выберите семью"); return; }
    setError("");
    setStep("details");
    loadTargets(familyId);
  }

  // Pre-fill amount when a booking/subscription is selected
  function handleBookingSelect(id: string) {
    setBookingId(id);
    // No auto-fill for bookings (price depends on direction, varies)
  }

  function handleSubSelect(id: string) {
    setSubId(id);
    const sub = targets?.subscriptions.find(s => s.id === id);
    if (sub) setAmount(String(sub.priceRub));
  }

  async function handleSave() {
    setError("");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Укажите сумму"); return;
    }
    if (kind === "booking" && !bookingId) { setError("Выберите запись"); return; }
    if (kind === "subscription" && !subscriptionId) { setError("Выберите абонемент"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountRub: Number(amount),
          method,
          bookingId:      kind === "booking"      ? bookingId      : null,
          subscriptionId: kind === "subscription" ? subscriptionId : null,
          notes: notes || undefined,
          isPaid,
        }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Ошибка"); return; }
      setOpen(false);
      reset();
      router.refresh();
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <Button size="sm" onClick={() => { reset(); setOpen(true); }}>
        <Plus className="h-4 w-4 mr-1" />
        Внести оплату
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ручное внесение оплаты</DialogTitle>
          </DialogHeader>

          {step === "family" ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Семья</label>
                {families.map((f) => (
                  <button key={f.id} onClick={() => setFamilyId(f.id)}
                    className={`w-full text-left rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                      familyId === f.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    {f.name}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
                <Button onClick={handleFamilyNext}>Далее</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {/* Payment kind */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Назначение</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["booking", "subscription", "misc"] as const).map((k) => (
                    <button key={k} onClick={() => { setKind(k); setBookingId(""); setSubId(""); }}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${
                        kind === k ? "border-brand-400 bg-brand-50 text-brand-700" : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}>
                      {k === "booking" ? "Занятие" : k === "subscription" ? "Абонемент" : "Прочее"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking selector */}
              {kind === "booking" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Запись</label>
                  {loadingTargets ? (
                    <p className="text-xs text-gray-400">Загрузка...</p>
                  ) : targets?.bookings.length === 0 ? (
                    <p className="text-xs text-gray-400">Нет неоплаченных записей</p>
                  ) : (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {targets?.bookings.map((b) => (
                        <button key={b.id} onClick={() => handleBookingSelect(b.id)}
                          className={`w-full text-left rounded-xl border px-3 py-2 text-xs transition-colors ${
                            bookingId === b.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <span className="font-medium">{b.child.name}</span>
                          <span className="text-gray-400 ml-1.5">
                            {b.classSession.direction.name} · {new Date(b.classSession.startTime).toLocaleDateString("ru")}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subscription selector */}
              {kind === "subscription" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Абонемент</label>
                  {loadingTargets ? (
                    <p className="text-xs text-gray-400">Загрузка...</p>
                  ) : targets?.subscriptions.length === 0 ? (
                    <p className="text-xs text-gray-400">Нет неоплаченных абонементов</p>
                  ) : (
                    <div className="space-y-1.5">
                      {targets?.subscriptions.map((s) => (
                        <button key={s.id} onClick={() => handleSubSelect(s.id)}
                          className={`w-full text-left rounded-xl border px-3 py-2 text-xs transition-colors ${
                            subscriptionId === s.id ? "border-brand-400 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <span className="font-medium">{SUB_LABELS[s.type] || s.type}</span>
                          <span className="text-gray-400 ml-1.5">
                            {s.totalClasses} занятий · {s.priceRub} ₽
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Amount + method */}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Сумма (₽)" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Способ</label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(METHOD_LABELS).map(([v, l]) => (
                        <SelectItem key={v} value={v}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Комментарий</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>

              {/* isPaid toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={isPaid} onChange={() => setIsPaid(!isPaid)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-gray-700">Оплачено сейчас</span>
              </label>

              {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

              <DialogFooter>
                <Button variant="outline" onClick={() => setStep("family")} disabled={loading}>Назад</Button>
                <Button onClick={handleSave} loading={loading}>Сохранить</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
