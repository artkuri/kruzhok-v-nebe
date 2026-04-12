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
import { Check } from "lucide-react";

export function MarkPaidButton({ paymentId }: { paymentId: string }) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);

  async function handleMark() {
    setLoading(true);

    const res = await fetch(`/api/payments/${paymentId}/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method }),
    });

    setLoading(false);

    if (!res.ok) {
      toast({ title: "Ошибка", variant: "destructive" });
      return;
    }

    toast({ title: "Оплата подтверждена", variant: "success" });
    setOpen(false);
    window.location.reload();
  }

  return (
    <>
      <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        onClick={() => setOpen(true)}>
        <Check className="h-3.5 w-3.5" />
        Оплачено
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить оплату</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Способ оплаты</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Наличные</SelectItem>
                <SelectItem value="TRANSFER">Перевод</SelectItem>
                <SelectItem value="ON_SITE">На месте</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Отмена</Button>
            <Button variant="success" onClick={handleMark} loading={loading}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
