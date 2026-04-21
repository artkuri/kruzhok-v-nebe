export const metadata = { title: "Публичная оферта — Кружок в небе" };

export default function OfferPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Публичная оферта на оказание услуг</h1>
      <p className="text-sm text-gray-500 mb-8">
        ИП Курилова Ильмира Илдаровна (ИНН 027005068470, ОГРН 320028000064447) предлагает заключить
        договор на следующих условиях:
      </p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Предмет</h2>
          <p className="text-sm">Оказание услуг по проведению занятий (кружки, обучение).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Заключение договора</h2>
          <p className="text-sm text-gray-600">Договор считается заключённым при оплате либо при отправке заявки.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Оплата</h2>
          <p className="text-sm">
            Стоимость услуг указана на сайте. Оплата возможна онлайн или иным согласованным способом.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Права и обязанности</h2>
          <div className="text-sm space-y-2">
            <p className="font-medium">Исполнитель:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5 text-gray-600">
              <li>Оказывает услуги в соответствии с расписанием</li>
              <li>Вправе изменять расписание с уведомлением клиента</li>
            </ul>
            <p className="font-medium mt-2">Клиент:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5 text-gray-600">
              <li>Предоставляет корректные данные</li>
              <li>Соблюдает правила студии</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Ответственность</h2>
          <p className="text-sm text-gray-600">
            Исполнитель не несёт ответственности за пропуски занятий по вине клиента и действия
            третьих лиц.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Возврат средств</h2>
          <div className="text-sm space-y-1 text-gray-600">
            <p>Возврат возможен до начала занятий или при отмене со стороны Исполнителя.</p>
            <p>Частичный возврат — за неиспользованные занятия.</p>
            <p>Возврат за фактически оказанные или пропущенные занятия не производится.</p>
            <p>Срок возврата — до 10 рабочих дней.</p>
            <p>
              Запрос на возврат:{" "}
              <a href="mailto:kruzhokvnebe@rambler.ru" className="text-brand-600 hover:underline">
                kruzhokvnebe@rambler.ru
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Персональные данные</h2>
          <p className="text-sm text-gray-600">
            Клиент даёт согласие на обработку персональных данных в соответствии с{" "}
            <a href="/privacy" className="text-brand-600 hover:underline">
              Политикой конфиденциальности
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Контакты</h2>
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
