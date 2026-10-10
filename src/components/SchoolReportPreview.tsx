import { useWords } from "@/lib/editorial";
export function SchoolReportPreview() {
  const w = useWords();
  return (
    <section className="school-report-preview field-section">
      <p className="micro">
        {w(
          "SAMPLE REPORT · FICTIONAL DATA",
          "NAMUNA HISOBOT · TO‘QIMA MA’LUMOT",
          "ПРИМЕР ОТЧЁТА · ВЫМЫШЛЕННЫЕ ДАННЫЕ",
        )}
      </p>
      <h2>
        {w("What a school can review", "Maktab nimalarni ko‘ra oladi", "Что может увидеть школа")}
      </h2>
      <p>
        {w(
          "After students join with your school code, your principal can review their individual assessment results and class summaries. Agree who will use reports and obtain the required student/parent permissions before inviting students. These suggestions support conversations; they are not selection rankings.",
          "O‘quvchi maktab kodi bilan qo‘shilgach, direktor individual baholash natijalari va sinf xulosalarini ko‘ra oladi. Taklifdan oldin hisobotdan kim foydalanishini kelishing va kerakli o‘quvchi/ota-ona ruxsatlarini oling. Tavsiyalar suhbat uchun, saralash reytingi emas.",
          "После присоединения по коду директор может просматривать индивидуальные результаты и сводки класса. До приглашения согласуйте доступ к отчётам и получите необходимые разрешения учеников/родителей. Рекомендации помогают беседе, а не отбору.",
        )}
      </p>
      <div className="report-table-scroll">
        <table>
          <caption>
            {w(
              "Example only: these students and suggestions are made up.",
              "Faqat namuna: o‘quvchilar va tavsiyalar to‘qima.",
              "Только пример: ученики и рекомендации вымышлены.",
            )}
          </caption>
          <thead>
            <tr>
              {[
                w("Student", "O‘quvchi", "Ученик"),
                w("Career idea", "Kasb g‘oyasi", "Идея профессии"),
                w("Conversation or activity", "Suhbat yoki faoliyat", "Беседа или занятие"),
              ].map((x) => (
                <th scope="col" key={x}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">{w("Example A", "Namuna A", "Пример A")}</th>
              <td>{w("Data analyst", "Ma’lumot tahlilchisi", "Аналитик данных")}</td>
              <td>
                {w(
                  "Try making a small chart; discuss whether the work was enjoyable.",
                  "Kichik diagramma tuzib, jarayon yoqqanini muhokama qiling.",
                  "Постройте небольшой график и обсудите, понравилась ли работа.",
                )}
              </td>
            </tr>
            <tr>
              <th scope="row">{w("Example B", "Namuna B", "Пример B")}</th>
              <td>{w("Product designer", "Mahsulot dizayneri", "Дизайнер продукта")}</td>
              <td>
                {w(
                  "Sketch a solution to a familiar problem; explain the choices.",
                  "Tanish muammoga yechim chizing va tanlovlarni tushuntiring.",
                  "Нарисуйте решение знакомой проблемы и объясните выбор.",
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ol className="school-steps">
        <li>{w("1. Contact us", "1. Bizga yozing", "1. Свяжитесь с нами")}</li>
        <li>
          {w(
            "2. Agree the trial and price",
            "2. Sinov va narxni kelishing",
            "2. Согласуйте пробный запуск и цену",
          )}
        </li>
        <li>
          {w("3. Invite students", "3. O‘quvchilarni taklif qiling", "3. Пригласите учеников")}
        </li>
        <li>
          {w(
            "4. Review results together",
            "4. Natijani birga ko‘ring",
            "4. Обсудите результаты вместе",
          )}
        </li>
      </ol>
    </section>
  );
}
