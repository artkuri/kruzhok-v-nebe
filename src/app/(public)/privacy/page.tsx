export const metadata = { title: "Политика конфиденциальности — Кружок в небе" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Политика обработки персональных данных</h1>

      <p className="text-sm text-gray-500 mb-8">
        Настоящая Политика действует в отношении всей информации, которую сайт{" "}
        <a href="https://кружоквнебе.рф" className="text-brand-600 hover:underline">
          кружоквнебе.рф
        </a>{" "}
        может получить о Пользователе.
      </p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Общие положения</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>1.1. Оператор персональных данных:</strong>
            </p>
            <p>Индивидуальный предприниматель Курилова Ильмира Илдаровна</p>
            <p>ИНН: 027005068470</p>
            <p>ОГРН: 320028000064447</p>
            <p>Email: kruzhokvnebe@rambler.ru</p>
            <p className="mt-3">
              <strong>1.2.</strong> Использование сайта означает согласие Пользователя с настоящей Политикой.
            </p>
            <p>
              <strong>1.3.</strong> Сайт предназначен для родителей (законных представителей).
              Обработка данных детей осуществляется только с их согласия.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Персональные данные</h2>
          <p className="text-sm mb-2">Оператор может обрабатывать:</p>
          <div className="text-sm space-y-1">
            <p className="font-medium">Данные родителя:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5 text-gray-600">
              <li>ФИО</li>
              <li>Телефон</li>
              <li>Email</li>
            </ul>
            <p className="font-medium mt-2">Данные ребёнка:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5 text-gray-600">
              <li>Имя</li>
              <li>Возраст</li>
              <li>Иные данные, указанные в формах</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Цели обработки</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Запись на занятия</li>
            <li>Обратная связь</li>
            <li>Организация обучения</li>
            <li>Информирование об услугах</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Правовые основания</h2>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>ФЗ-152 «О персональных данных»</li>
            <li>Согласие пользователя</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Порядок обработки</h2>
          <p className="text-sm mb-2">Оператор осуществляет: сбор, хранение, использование, удаление.</p>
          <p className="text-sm">
            Передача третьим лицам возможна только при оказании услуг либо по требованию закона.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Защита данных</h2>
          <p className="text-sm">
            Принимаются меры для защиты от утечки и несанкционированного доступа.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Срок хранения</h2>
          <p className="text-sm">До достижения целей обработки или до отзыва согласия.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Права пользователя</h2>
          <p className="text-sm mb-1">Пользователь имеет право:</p>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
            <li>Запросить свои данные</li>
            <li>Изменить их</li>
            <li>Отозвать согласие</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Контакты</h2>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:kruzhokvnebe@rambler.ru" className="text-brand-600 hover:underline">
              kruzhokvnebe@rambler.ru
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
