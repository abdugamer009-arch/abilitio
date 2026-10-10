import { useCallback } from "react";
import { useI18n } from "./i18n";
/** Existing UI phrases only; stored values remain unchanged. */
const labels: Record<string, { uz: string; ru: string }> = {
  "No assessment yet": {
    uz: "Hali baholash yo‘q",
    ru: "Оценки пока нет",
  },
  "Take your first assessment to see your assessment profile.": {
    uz: "Profilingizni ko‘rish uchun birinchi baholashni yakunlang.",
    ru: "Пройдите первую оценку, чтобы увидеть свой профиль.",
  },
  "Reasoning / 10": {
    uz: "Mantiq / 10",
    ru: "Мышление / 10",
  },
  Personality: {
    uz: "Shaxsiyat",
    ru: "Личность",
  },
  Assessments: {
    uz: "Baholashlar",
    ru: "Оценки",
  },
  "Total taken": {
    uz: "Jami topshirilgan",
    ru: "Всего пройдено",
  },
  "Top Strengths": {
    uz: "Asosiy kuchli tomonlar",
    ru: "Сильные стороны",
  },
  "No data yet.": {
    uz: "Hali ma’lumot yo‘q.",
    ru: "Данных пока нет.",
  },
  "Growth Areas": {
    uz: "Rivojlanish yo‘nalishlari",
    ru: "Направления развития",
  },
  "All round excellence.": {
    uz: "Har tomonlama rivojlanish.",
    ru: "Всестороннее развитие.",
  },
  "No career data yet.": {
    uz: "Hali kasb ma’lumotlari yo‘q.",
    ru: "Данных о профессиях пока нет.",
  },
  "Try Career Battles": {
    uz: "Kasblarni solishtiring",
    ru: "Сравнить профессии",
  },
  "Compare your top careers side-by-side with AI insights": {
    uz: "Asosiy kasblaringizni AI izohlari bilan solishtiring",
    ru: "Сравните свои основные профессии с пояснениями ИИ",
  },
  "Assessment History": {
    uz: "Baholashlar tarixi",
    ru: "История оценок",
  },
  Type: {
    uz: "Tur",
    ru: "Тип",
  },
  "Top:": {
    uz: "Asosiy:",
    ru: "Основное:",
  },
  Save: {
    uz: "Saqlash",
    ru: "Сохранить",
  },
  "Edit Stats": {
    uz: "Ballarni tahrirlash",
    ru: "Изменить баллы",
  },
  Cancel: {
    uz: "Bekor qilish",
    ru: "Отмена",
  },
  "Achievements & Activities": {
    uz: "Yutuqlar va faoliyatlar",
    ru: "Достижения и занятия",
  },
  Add: {
    uz: "Qo‘shish",
    ru: "Добавить",
  },
  "e.g. Founder of NavoiUnity": {
    uz: "masalan, NavoiUnity asoschisi",
    ru: "например, основатель NavoiUnity",
  },
  "Short description (optional)": {
    uz: "Qisqa tavsif (ixtiyoriy)",
    ru: "Краткое описание (необязательно)",
  },
  "No achievements yet. Add your first one — e.g.": {
    uz: "Hali yutuqlar yo‘q. Birinchisini qo‘shing — masalan,",
    ru: "Достижений пока нет. Добавьте первое — например,",
  },
  '"Olympiad Participant"': {
    uz: '"Olimpiada ishtirokchisi"',
    ru: '"Участник олимпиады"',
  },
  or: {
    uz: "yoki",
    ru: "или",
  },
  '"Debate Club Member"': {
    uz: '"Munozara klubi a’zosi"',
    ru: '"Участник дискуссионного клуба"',
  },
  "Founder access": {
    uz: "Asoschi kirishi",
    ru: "Доступ основателя",
  },
  "Open Admin Dashboard": {
    uz: "Administrator panelini ochish",
    ru: "Открыть панель администратора",
  },
  "Analytics and user management": {
    uz: "Tahlil va foydalanuvchilarni boshqarish",
    ru: "Аналитика и управление пользователями",
  },
  Profile: {
    uz: "Profil",
    ru: "Профиль",
  },
  Email: {
    uz: "Elektron pochta",
    ru: "Электронная почта",
  },
  "First name": {
    uz: "Ism",
    ru: "Имя",
  },
  "Last name": {
    uz: "Familiya",
    ru: "Фамилия",
  },
  "Edit profile": {
    uz: "Profilni tahrirlash",
    ru: "Изменить профиль",
  },
  Preferences: {
    uz: "Sozlamalar",
    ru: "Настройки",
  },
  Language: {
    uz: "Til",
    ru: "Язык",
  },
  "Switch interface language": {
    uz: "Interfeys tilini o‘zgartiring",
    ru: "Изменить язык интерфейса",
  },
  Appearance: {
    uz: "Ko‘rinish",
    ru: "Оформление",
  },
  "Light or dark theme": {
    uz: "Yorug‘ yoki qorong‘i mavzu",
    ru: "Светлая или тёмная тема",
  },
  Security: {
    uz: "Xavfsizlik",
    ru: "Безопасность",
  },
  "Reset your password — we'll send a secure link to your email.": {
    uz: "Parolni tiklang — pochtangizga xavfsiz havola yuboramiz.",
    ru: "Сбросьте пароль — мы отправим безопасную ссылку на вашу почту.",
  },
  "Send reset link": {
    uz: "Tiklash havolasini yuborish",
    ru: "Отправить ссылку для сброса",
  },
  Session: {
    uz: "Seans",
    ru: "Сеанс",
  },
  "Sign out from this device. Check your save status before leaving.": {
    uz: "Shu qurilmadan chiqing. Chiqishdan oldin saqlash holatini tekshiring.",
    ru: "Выйдите на этом устройстве. Перед выходом проверьте сохранение.",
  },
  "Weekly digest email": {
    uz: "Haftalik xulosa xati",
    ru: "Еженедельная рассылка",
  },
  "Activate in Lovable integrations to enable sending": {
    uz: "Xat yuborish uchun Lovable integratsiyasini yoqing",
    ru: "Включите интеграцию Lovable для отправки",
  },
  "Loading admin dashboard": {
    uz: "Administrator paneli yuklanmoqda",
    ru: "Загрузка панели администратора",
  },
  "Signed in as": {
    uz: "Hisob:",
    ru: "Вход выполнен как",
  },
  "Go home": {
    uz: "Bosh sahifaga",
    ru: "На главную",
  },
  "Admin Dashboard": {
    uz: "Administrator paneli",
    ru: "Панель администратора",
  },
  "Founder-level analytics & user management": {
    uz: "Asoschi uchun tahlil va foydalanuvchilarni boshqarish",
    ru: "Аналитика и управление пользователями для основателя",
  },
  Engagement: {
    uz: "Faollik",
    ru: "Активность",
  },
  "Daily Active Users": {
    uz: "Kunlik faol foydalanuvchilar",
    ru: "Активные пользователи за день",
  },
  "Weekly Active Users": {
    uz: "Haftalik faol foydalanuvchilar",
    ru: "Активные пользователи за неделю",
  },
  "Monthly Active Users": {
    uz: "Oylik faol foydalanuvchilar",
    ru: "Активные пользователи за месяц",
  },
  "Most Popular Career": {
    uz: "Eng mashhur kasb",
    ru: "Самая популярная профессия",
  },
  Platform: {
    uz: "Platforma",
    ru: "Платформа",
  },
  "Total Users": {
    uz: "Jami foydalanuvchilar",
    ru: "Всего пользователей",
  },
  "Completed Assessments": {
    uz: "Yakunlangan baholashlar",
    ru: "Завершённые оценки",
  },
  "New This Week": {
    uz: "Shu haftadagi yangi foydalanuvchilar",
    ru: "Новые за неделю",
  },
  "New This Month": {
    uz: "Shu oydagi yangi foydalanuvchilar",
    ru: "Новые за месяц",
  },
  "Most Active Community": {
    uz: "Eng faol hamjamiyat",
    ru: "Самое активное сообщество",
  },
  "Signups — last 7 days": {
    uz: "Ro‘yxatdan o‘tishlar — oxirgi 7 kun",
    ru: "Регистрации — последние 7 дней",
  },
  "Most popular careers": {
    uz: "Eng mashhur kasblar",
    ru: "Самые популярные профессии",
  },
  "Personality types distribution": {
    uz: "Shaxsiyat turlari taqsimoti",
    ru: "Распределение типов личности",
  },
  "User management": {
    uz: "Foydalanuvchilarni boshqarish",
    ru: "Управление пользователями",
  },
  "Search by name or email": {
    uz: "Ism yoki pochta bo‘yicha qidirish",
    ru: "Поиск по имени или почте",
  },
  User: {
    uz: "Foydalanuvchi",
    ru: "Пользователь",
  },
  Joined: {
    uz: "Qo‘shilgan",
    ru: "Дата регистрации",
  },
  Age: {
    uz: "Yosh",
    ru: "Возраст",
  },
  Assessment: {
    uz: "Baholash",
    ru: "Оценка",
  },
  Actions: {
    uz: "Amallar",
    ru: "Действия",
  },
  banned: {
    uz: "bloklangan",
    ru: "заблокирован",
  },
  done: {
    uz: "yakunlangan",
    ru: "завершено",
  },
  "No users found.": {
    uz: "Foydalanuvchilar topilmadi.",
    ru: "Пользователи не найдены.",
  },
  "School registered": {
    uz: "Maktab ro‘yxatdan o‘tdi",
    ru: "Школа зарегистрирована",
  },
  "Share this code with your students so they can join.": {
    uz: "O‘quvchilar qo‘shilishi uchun ushbu kodni ulashing.",
    ru: "Передайте код ученикам, чтобы они могли присоединиться.",
  },
  "Copy code": {
    uz: "Kodni nusxalash",
    ru: "Копировать код",
  },
  "Go to principal dashboard": {
    uz: "Direktor paneliga o‘tish",
    ru: "Перейти в панель директора",
  },
  "Register your school": {
    uz: "Maktabni ro‘yxatdan o‘tkazing",
    ru: "Зарегистрируйте школу",
  },
  "Create your school's principal account on Abilitio.": {
    uz: "Abilitio’da maktabingiz direktori hisobini yarating.",
    ru: "Создайте аккаунт директора вашей школы в Abilitio.",
  },
  "School Name": {
    uz: "Maktab nomi",
    ru: "Название школы",
  },
  "Principal Name": {
    uz: "Direktor ismi",
    ru: "Имя директора",
  },
  "School Email": {
    uz: "Maktab elektron pochtasi",
    ru: "Электронная почта школы",
  },
  Phone: {
    uz: "Telefon",
    ru: "Телефон",
  },
  City: {
    uz: "Shahar",
    ru: "Город",
  },
  Country: {
    uz: "Davlat",
    ru: "Страна",
  },
  "Number of Students (estimate)": {
    uz: "O‘quvchilar soni (taxminiy)",
    ru: "Число учеников (примерно)",
  },
  "Register school": {
    uz: "Maktabni ro‘yxatdan o‘tkazish",
    ru: "Зарегистрировать школу",
  },
  "AI Class Builder": {
    uz: "AI sinf konstruktori",
    ru: "Конструктор классов с ИИ",
  },
  "Create Specialized Class": {
    uz: "Ixtisoslashgan sinf yaratish",
    ru: "Создать специализированный класс",
  },
  "Select a focus area — Abilitio recommends the best-matched students from your school.": {
    uz: "Yo‘nalishni tanlang — Abilitio maktabingizdagi eng mos o‘quvchilarni tavsiya qiladi.",
    ru: "Выберите направление — Abilitio рекомендует наиболее подходящих учеников вашей школы.",
  },
  "Focus area": {
    uz: "Yo‘nalish",
    ru: "Направление",
  },
  "Class size": {
    uz: "Sinf hajmi",
    ru: "Размер класса",
  },
  Build: {
    uz: "Yaratish",
    ru: "Создать",
  },
  "Class saved ✓": {
    uz: "Sinf saqlandi ✓",
    ru: "Класс сохранён ✓",
  },
  "Recommended students —": {
    uz: "Tavsiya etilgan o‘quvchilar —",
    ru: "Рекомендуемые ученики —",
  },
  Class: {
    uz: "Sinf",
    ru: "Класс",
  },
  "Ranked by composite Personality + Cognitive + Interest fit.": {
    uz: "Shaxsiyat, mantiq va qiziqish mosligining umumiy ko‘rsatkichi bo‘yicha tartiblangan.",
    ru: "Ранжирование по совокупному соответствию личности, мышления и интересов.",
  },
  "No students with matching profiles yet. Ask students to complete the Career Intelligence assessment.":
    {
      uz: "Hali mos profilli o‘quvchilar yo‘q. O‘quvchilardan kasbiy baholashni yakunlashni so‘rang.",
      ru: "Подходящих профилей пока нет. Попросите учеников пройти карьерную оценку.",
    },
  "← Back to analytics": {
    uz: "← Tahlilga qaytish",
    ru: "← Назад к аналитике",
  },
  "Loading school report": {
    uz: "Maktab hisoboti yuklanmoqda",
    ru: "Загрузка отчёта школы",
  },
  "← Back to dashboard": {
    uz: "← Panelga qaytish",
    ru: "← Назад к панели",
  },
  "Print / Save as PDF": {
    uz: "Chop etish / PDF saqlash",
    ru: "Печать / Сохранить PDF",
  },
  "Abilitio · School Report": {
    uz: "Abilitio · Maktab hisoboti",
    ru: "Abilitio · Отчёт школы",
  },
  "· Code": {
    uz: "· Kod",
    ru: "· Код",
  },
  Students: {
    uz: "O‘quvchilar",
    ru: "Ученики",
  },
  Classes: {
    uz: "Sinflar",
    ru: "Классы",
  },
  Completed: {
    uz: "Yakunlangan",
    ru: "Завершено",
  },
  Completion: {
    uz: "Yakunlash",
    ru: "Завершение",
  },
  "Talent Distribution": {
    uz: "Iste’dodlar taqsimoti",
    ru: "Распределение талантов",
  },
  Orientation: {
    uz: "Yo‘nalish",
    ru: "Направление",
  },
  "Class Composition": {
    uz: "Sinf tarkibi",
    ru: "Состав класса",
  },
  students: {
    uz: "o‘quvchi",
    ru: "учеников",
  },
  "Strategic AI Recommendations": {
    uz: "AI strategik tavsiyalari",
    ru: "Стратегические рекомендации ИИ",
  },
  "Generated by Abilitio ·": {
    uz: "Abilitio tomonidan yaratilgan ·",
    ru: "Создано Abilitio ·",
  },
  "Profile Photo": {
    uz: "Profil rasmi",
    ru: "Фото профиля",
  },
  "Drag & drop or": {
    uz: "Suratni tortib olib keling yoki",
    ru: "Перетащите фото или",
  },
  browse: {
    uz: "tanlang",
    ru: "выберите",
  },
  "JPG, PNG or WEBP · up to 5 MB": {
    uz: "JPG, PNG yoki WEBP · 5 MB gacha",
    ru: "JPG, PNG или WEBP · до 5 МБ",
  },
  Remove: {
    uz: "O‘chirish",
    ru: "Удалить",
  },
  "Using default avatar": {
    uz: "Standart avatar ishlatilmoqda",
    ru: "Используется стандартный аватар",
  },
  Engineering: {
    uz: "Muhandislik",
    ru: "Инженерия",
  },
  Healthcare: {
    uz: "Sog‘liqni saqlash",
    ru: "Здравоохранение",
  },
  Business: {
    uz: "Biznes",
    ru: "Бизнес",
  },
  Technology: {
    uz: "Texnologiya",
    ru: "Технологии",
  },
  Law: {
    uz: "Huquq",
    ru: "Право",
  },
  Media: {
    uz: "Ommaviy axborot",
    ru: "Медиа",
  },
  Architecture: {
    uz: "Arxitektura",
    ru: "Архитектура",
  },
  Psychology: {
    uz: "Psixologiya",
    ru: "Психология",
  },
  Design: {
    uz: "Dizayn",
    ru: "Дизайн",
  },
  Education: {
    uz: "Ta’lim",
    ru: "Образование",
  },
  Science: {
    uz: "Fan",
    ru: "Наука",
  },
  Finance: {
    uz: "Moliya",
    ru: "Финансы",
  },
  Ban: {
    uz: "Bloklash",
    ru: "Заблокировать",
  },
  Unban: {
    uz: "Blokdan chiqarish",
    ru: "Разблокировать",
  },
  "Password reset link sent to your email.": {
    uz: "Parolni tiklash havolasi pochtangizga yuborildi.",
    ru: "Ссылка для сброса пароля отправлена на почту.",
  },
  "Change photo": {
    uz: "Rasmni o‘zgartirish",
    ru: "Изменить фото",
  },
  "Upload photo": {
    uz: "Rasm yuklash",
    ru: "Загрузить фото",
  },
  "Please upload a JPG, PNG, or WEBP image.": {
    uz: "JPG, PNG yoki WEBP rasm yuklang.",
    ru: "Загрузите изображение JPG, PNG или WEBP.",
  },
  "Image must be smaller than 5 MB.": {
    uz: "Rasm 5 MB dan kichik bo‘lishi kerak.",
    ru: "Изображение должно быть меньше 5 МБ.",
  },
  "Upload failed.": {
    uz: "Yuklash bajarilmadi.",
    ru: "Не удалось загрузить.",
  },
  "Remove failed.": {
    uz: "O‘chirish bajarilmadi.",
    ru: "Не удалось удалить.",
  },
  "Admin only": {
    uz: "Faqat administrator uchun",
    ru: "Только для администратора",
  },
  "Admin dashboard error": {
    uz: "Administrator paneli xatosi",
    ru: "Ошибка панели администратора",
  },
  "This account is not an admin.": {
    uz: "Ushbu hisob administrator emas.",
    ru: "Этот аккаунт не является администратором.",
  },
  "Access check or data loading failed on the server.": {
    uz: "Serverda kirishni tekshirish yoki ma’lumot yuklash bajarilmadi.",
    ru: "На сервере не удалось проверить доступ или загрузить данные.",
  },
  "Failed to register school.": {
    uz: "Maktabni ro‘yxatdan o‘tkazib bo‘lmadi.",
    ru: "Не удалось зарегистрировать школу.",
  },
  "Failed to build class.": {
    uz: "Sinfni yaratib bo‘lmadi.",
    ru: "Не удалось создать класс.",
  },
  "SAT Score": {
    uz: "SAT bali",
    ru: "Балл SAT",
  },
  "IELTS Band": {
    uz: "IELTS bali",
    ru: "Балл IELTS",
  },
  Medical: {
    uz: "Tibbiyot",
    ru: "Медицина",
  },
  Creative: {
    uz: "Ijodiy",
    ru: "Творчество",
  },
  Communication: {
    uz: "Muloqot",
    ru: "Общение",
  },
  Research: {
    uz: "Tadqiqot",
    ru: "Исследования",
  },
  Leadership: {
    uz: "Yetakchilik",
    ru: "Лидерство",
  },
  "Top Analytical Thinkers": {
    uz: "Asosiy tahliliy fikrlovchilar",
    ru: "Сильнейшие аналитики",
  },
  "Top Leaders": {
    uz: "Asosiy yetakchilar",
    ru: "Сильнейшие лидеры",
  },
  "Top Communicators": {
    uz: "Asosiy muloqotchilar",
    ru: "Сильнейшие коммуникаторы",
  },
  "Top Creatives": {
    uz: "Asosiy ijodkorlar",
    ru: "Сильнейшие творческие ученики",
  },
  "Top Problem Solvers": {
    uz: "Asosiy muammo yechuvchilar",
    ru: "Сильнейшие в решении задач",
  },
  "Top Researchers": {
    uz: "Asosiy tadqiqotchilar",
    ru: "Сильнейшие исследователи",
  },
  "Top Entrepreneurs": {
    uz: "Asosiy tadbirkorlar",
    ru: "Сильнейшие предприниматели",
  },
  Strong: {
    uz: "Kuchli",
    ru: "Сильный",
  },
  "Analytical thinking": {
    uz: "Tahliliy fikrlash",
    ru: "Аналитическое мышление",
  },
  "Unique mind": {
    uz: "O‘ziga xos fikrlash",
    ru: "Уникальное мышление",
  },
  "Strategic, independent, and visionary.": {
    uz: "Strategik, mustaqil va istiqbolni ko‘ra oladigan.",
    ru: "Стратегический, независимый, дальновидный.",
  },
  "Analytical, original, and endlessly curious.": {
    uz: "Tahliliy, o‘ziga xos va doimo qiziquvchan.",
    ru: "Аналитический, оригинальный, любознательный.",
  },
  "Decisive leader with bold long-term vision.": {
    uz: "Uzoq istiqbolni ko‘radigan qat’iyatli yetakchi.",
    ru: "Решительный лидер со смелым долгосрочным видением.",
  },
  "Inventive debater who thrives on new ideas.": {
    uz: "Yangi g‘oyalardan ilhom oluvchi topqir munozarachi.",
    ru: "Изобретательный спорщик, вдохновляющийся новыми идеями.",
  },
  "Insightful idealist driven by purpose.": {
    uz: "Maqsadga intiluvchi ziyrak idealist.",
    ru: "Проницательный идеалист, движимый целью.",
  },
  "Imaginative, empathetic, and value-driven.": {
    uz: "Tasavvurli, hamdard va qadriyatlarga tayanadigan.",
    ru: "Творческий, чуткий, опирающийся на ценности.",
  },
  "Charismatic mentor who inspires others.": {
    uz: "Boshqalarni ilhomlantiruvchi jozibali ustoz.",
    ru: "Харизматичный наставник, вдохновляющий других.",
  },
  "Enthusiastic creator who connects people.": {
    uz: "Odamlarni bog‘laydigan jo‘shqin ijodkor.",
    ru: "Увлечённый создатель, объединяющий людей.",
  },
  "Reliable, organized, and detail-oriented.": {
    uz: "Ishonchli, tartibli va tafsilotlarga e’tiborli.",
    ru: "Надёжный, организованный, внимательный к деталям.",
  },
  "Warm, dedicated, and quietly supportive.": {
    uz: "Samimiy, sadoqatli va osoyishta qo‘llab-quvvatlovchi.",
    ru: "Тёплый, преданный, ненавязчиво поддерживающий.",
  },
  "Practical leader who gets things done.": {
    uz: "Ishlarni yakunlaydigan amaliy yetakchi.",
    ru: "Практичный лидер, доводящий дела до конца.",
  },
  "Caring connector who builds harmony.": {
    uz: "Uyg‘unlik yaratadigan g‘amxo‘r birlashtiruvchi.",
    ru: "Заботливый объединитель, создающий гармонию.",
  },
  "Hands-on problem solver and tinkerer.": {
    uz: "Amalda muammo yechadigan tajribachi.",
    ru: "Практический решатель задач и экспериментатор.",
  },
  "Gentle artist with a deep aesthetic sense.": {
    uz: "Chuqur estetik didli muloyim ijodkor.",
    ru: "Мягкий художник с глубоким чувством эстетики.",
  },
  "Bold doer who thrives in the moment.": {
    uz: "Ayni damda faol bo‘lgan dadil amaliyotchi.",
    ru: "Смелый деятель, живущий моментом.",
  },
  "Energetic performer who brings the fun.": {
    uz: "Quvonch ulashadigan serg‘ayrat ijrochi.",
    ru: "Энергичный исполнитель, приносящий радость.",
  },
  "Invite students with your school code to see their completed assessment summaries.": {
    uz: "Yakunlangan baholash xulosalarini ko‘rish uchun o‘quvchilarni maktab kodi bilan taklif qiling.",
    ru: "Пригласите учеников по коду школы, чтобы увидеть сводки завершённых оценок.",
  },
  "Saved on this device; email delivery is not connected.": {
    uz: "Shu qurilmada saqlanadi; xat yuborish ulanmagan.",
    ru: "Сохраняется на устройстве; отправка писем не подключена.",
  },
};
export function useUiText() {
  const { lang } = useI18n();
  return useCallback(
    (english: string) => (lang === "en" ? english : (labels[english]?.[lang] ?? english)),
    [lang],
  );
}
