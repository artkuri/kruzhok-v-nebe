"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Что-то пошло не так</h1>
        <p className="text-gray-500 text-sm mb-4">
          Произошла ошибка при загрузке страницы.
        </p>
        {error.message && (
          <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-4 text-left font-mono break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
