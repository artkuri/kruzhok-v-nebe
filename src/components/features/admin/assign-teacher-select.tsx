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
  sessionId: string;
  currentTeacherId: string | null;
  teachers: Teacher[];
}

export function AssignTeacherSelect({ sessionId, currentTeacherId, teachers }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleChange(value: string) {
    setSaving(true);
    try {
      await fetch(`/api/classes/${sessionId}`, {
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
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 shrink-0">Педагог:</span>
      <Select
        defaultValue={currentTeacherId ?? "__none__"}
        onValueChange={handleChange}
        disabled={saving}
      >
        <SelectTrigger className="w-48 h-8 text-sm">
          <SelectValue placeholder="Не назначен" />
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
      {saving && <span className="text-xs text-gray-400">Сохраняю...</span>}
    </div>
  );
}
