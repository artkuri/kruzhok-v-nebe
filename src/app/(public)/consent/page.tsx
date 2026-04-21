export const metadata = { title: "Согласие на обработку персональных данных — Кружок в небе" };

export default function ConsentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Согласие на обработку персональных данных
      </h1>
      <p className="text-sm text-gray-500 mb-8">Согласие родителя (законного представителя)</p>

      <p className="text-sm text-gray-700 mb-6">
        Я, оставляя данные на сайте{" "}
        <a href="https://кружоквнебе.рф" className="text-brand-600 hover:underline">
          кружоквнебе.рф
        </a>
        :
      </p>

      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-8 text-sm text-gray-700 space-y-1">
        <p>✔ Подтверждаю, что являюсь родителем или законным представителем ребёнка</p>
        <p>✔ Даю согласие ИП Куриловой Ильмире Илдаровне на обработку персональных данных</p>
      </div>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Перечень данных</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Мои данные: ФИО, телефон, email</li>
            <li>Данные ребёнка: имя, возраст и иные данные из форм</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Цели</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Запись на занятия</li>
            <li>Связь со мной</li>
            <li>Организация обучения</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Действия с данными</h2>
          <p className="text-sm text-gray-600">Сбор, хранение, использование, удаление.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Срок</h2>
          <p className="text-sm text-gray-600">До достижения целей или отзыва согласия.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Отзыв согласия</h2>
          <p className="text-sm">
            По email:{" "}
            <a href="mailto:kruzhokvnebe@rambler.ru" className="text-brand-600 hover:underline">
              kruzhokvnebe@rambler.ru
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Подтверждение</h2>
          <p className="text-sm text-gray-600 mb-1">Отправляя форму, я:</p>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Подтверждаю достоверность данных</li>
            <li>Принимаю условия политики конфиденциальности</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
