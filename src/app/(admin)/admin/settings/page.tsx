export const metadata = { title: "Настройки" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Студия</h2>
        <div className="grid gap-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Название студии</span>
            <span className="text-sm font-medium text-gray-900">Кружок в небе</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Максимум на занятии</span>
            <span className="text-sm font-medium text-gray-900">10 человек</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Отмена без потери</span>
            <span className="text-sm font-medium text-gray-900">За 3 часа до занятия</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
        Расширенные настройки (изменение прайсов, интеграции) — в следующих версиях.
      </div>
    </div>
  );
}
