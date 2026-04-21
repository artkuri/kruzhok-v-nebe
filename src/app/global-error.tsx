"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="ru">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Что-то пошло не так</h1>
            <p className="text-gray-500 text-sm mb-4">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу.
            </p>
            {error.message && (
              <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-4 text-left font-mono break-all">
                {error.message}
              </p>
            )}
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
