"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Teacher {
  id: string;
  user: { name: string };
}

interface Props {
  slotId: string;
  currentTeacherId: string | null;
  teachers: Teacher[];
}

export function AssignSlotTeacherSelect({ slotId, currentTeacherId, teachers }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleChange(value: string) {
    setSaving(true);
    try {
      await fetch(`/api/schedule-slots/${slotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId: value === "__none__" ? null : value }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Select
        defaultValue={currentTeacherId ?? "__none__"}
        onValueChange={handleChange}
        disabled={saving}
      >
        <SelectTrigger className="h-7 text-xs border-gray-200 text-gray-500">
          <SelectValue placeholder="Педагог не назначен" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Не назначен</SelectItem>
          {teachers.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {saving && <span className="text-xs text-gray-400">...</span>}
    </div>
  );
}
