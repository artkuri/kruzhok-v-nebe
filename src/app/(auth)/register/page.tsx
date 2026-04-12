"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    familyName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Пароли не совпадают");
      return;
    }
    if (form.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          familyName: form.familyName || form.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      // Auto sign in
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/cabinet/schedule");
      } else {
        router.push("/login");
      }
    } catch (e) {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-violet-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-700 font-semibold text-xl mb-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            Кружок в небе
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Создать аккаунт</h1>
          <p className="text-gray-500 mt-1">Заполните данные для записи на занятия</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Ваше имя"
              value={form.name}
              onChange={update("name")}
              placeholder="Мария Иванова"
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Телефон"
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder="+7 900 000-00-00"
            />
            <Input
              label="Название семьи (необязательно)"
              value={form.familyName}
              onChange={update("familyName")}
              placeholder="Семья Ивановых"
              hint="Отображается в абонементах и записях"
            />
            <Input
              label="Пароль"
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Минимум 6 символов"
              required
              autoComplete="new-password"
            />
            <Input
              label="Подтвердите пароль"
              type="password"
              value={form.confirm}
              onChange={update("confirm")}
              placeholder="Повторите пароль"
              required
              autoComplete="new-password"
            />
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" loading={loading}>
              Зарегистрироваться
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
