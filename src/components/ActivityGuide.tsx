import { useWords } from "@/lib/editorial";
import { useI18n } from "@/lib/i18n";
import type { RoadmapTask } from "@/lib/roadmap/roadmap-world";

type Guide = {
  steps: [string, string, string];
  finish: [string, string, string];
  resource?: { name: string; url: string };
};
const GUIDES: Record<string, Guide> = {
  "tech:p1_t1": {
    steps: [
      "Use a Python editor. Make a list of three expenses. Add them with sum(), then print the total. Change one expense and run it again.",
      "Python muharririda uchta xarajat ro‘yxatini yozing. sum() bilan qo‘shing va natijani chiqaring. Bitta xarajatni o‘zgartirib qayta ishga tushiring.",
      "В редакторе Python создайте список из трёх расходов. Сложите их через sum() и выведите итог. Измените расход и запустите снова.",
    ],
    finish: [
      "Your program prints the correct total for two different lists. Save the code and explain what each line does.",
      "Dastur ikki xil ro‘yxat uchun to‘g‘ri yig‘indini chiqaradi. Kodni saqlang va har qatorni tushuntiring.",
      "Программа выдаёт верную сумму для двух списков. Сохраните код и объясните каждую строку.",
    ],
  },
  "tech:p1_t2": {
    steps: [
      "Choose a repeated calculation, such as a shopping total. Write the inputs and expected answer on paper. Build a script and test it with two examples.",
      "Xarid yig‘indisi kabi takroriy hisobni tanlang. Kirish sonlari va kutilgan javobni yozing. Skript tuzib, ikki misolda tekshiring.",
      "Выберите повторяющийся расчёт, например сумму покупок. Запишите входные данные и ожидаемый итог. Создайте скрипт и проверьте два примера.",
    ],
    finish: [
      "A saved script produces both expected answers. Write one sentence about the task it automates.",
      "Saqlangan skript ikkala kutilgan javobni chiqaradi. Nimani avtomatlashtirganini bir jumlada yozing.",
      "Сохранённый скрипт выдаёт оба ожидаемых ответа. Напишите, какую задачу он автоматизирует.",
    ],
  },
  "tech:p1_t3": {
    steps: [
      "Follow the GitHub Hello World guide. Use sample text rather than personal information. Create a repository, change its README on a branch, and merge the change.",
      "GitHub Hello World qo‘llanmasini bajaring. Shaxsiy ma’lumot emas, namuna matni yozing. Repo yarating, shoxda README’ni o‘zgartiring va birlashtiring.",
      "Пройдите Hello World GitHub. Используйте пример текста без личных данных. Создайте репозиторий, измените README в ветке и объедините изменения.",
    ],
    finish: [
      "Your repository shows the merged README change. Keep its link in your own notes.",
      "Repo birlashtirilgan README o‘zgarishini ko‘rsatadi. Havolasini o‘z qaydlaringizda saqlang.",
      "В репозитории видно объединённое изменение README. Сохраните ссылку в своих заметках.",
    ],
    resource: {
      name: "GitHub Hello World",
      url: "https://docs.github.com/en/get-started/using-github/hello-world",
    },
  },
  "tech:p1_t4": {
    steps: [
      "Use a new practice folder. In a terminal, check your location, list files, create a folder, enter it and return to its parent. Use the commands for your operating system; do not experiment in important folders.",
      "Yangi mashq papkasida ishlang. Terminalda joylashuvni ko‘ring, fayllarni sanang, papka yarating, unga kiring va qayting. Tizimingiz buyruqlaridan foydalaning; muhim papkalarda sinamang.",
      "Работайте в новой учебной папке. Узнайте текущую папку, выведите файлы, создайте папку, войдите в неё и вернитесь. Используйте команды своей ОС, не важные папки.",
    ],
    finish: [
      "You can repeat those five actions and explain each command. No files need to be deleted.",
      "Besh harakatni takrorlab, buyruqlarni tushuntira olasiz. Fayl o‘chirish shart emas.",
      "Вы можете повторить пять действий и объяснить команды. Удалять файлы не требуется.",
    ],
    resource: {
      name: "Ubuntu command line guide (Linux)",
      url: "https://ubuntu.com/tutorials/command-line-for-beginners",
    },
  },
  "creative:p1_t1": {
    steps: [
      "Try one small piece each in writing, drawing and video planning. Compare which process you enjoyed. Choose one medium for your next practice session; you can change later.",
      "Yozuv, rasm va video rejalashda bittadan kichik ish sinang. Qaysi jarayon yoqqanini solishtiring. Keyingi mashq uchun bittasini tanlang; keyin o‘zgartirish mumkin.",
      "Попробуйте короткий текст, рисунок и план видео. Сравните, какой процесс понравился. Выберите формат для следующей практики; позже его можно сменить.",
    ],
    finish: [
      "Save your three attempts and a short reason for your choice.",
      "Uchta urinish va tanlov sababini saqlang.",
      "Сохраните три попытки и краткую причину выбора.",
    ],
  },
  "creative:p1_t2": {
    steps: [
      "Choose a small repeatable exercise in your medium. Set a time you can keep, then make one piece each day for 30 days. Date each piece; missed days are information, not a failed assessment.",
      "Yo‘nalishingizda kichik takroriy mashq tanlang. Qulay vaqt belgilang va 30 kun har kuni bitta ish yarating. Sana qo‘ying; o‘tkazilgan kun baholashdagi xato emas.",
      "Выберите небольшое упражнение. Назначьте удобное время и создавайте по одной работе 30 дней. Ставьте даты; пропуск дня не означает провал оценки.",
    ],
    finish: [
      "Keep a dated practice log and reflect on one change in your process after the month.",
      "Sanali mashq daftarini saqlang, oy oxirida jarayondagi bitta o‘zgarishni yozing.",
      "Сохраните дневник с датами и опишите одно изменение в работе за месяц.",
    ],
  },
  "creative:p1_t3": {
    steps: [
      "Choose ten works you admire. Record the maker and source for each. Describe one choice of composition, wording or pacing, then try that technique in your own original work.",
      "Yoqtirgan o‘nta ishni tanlang. Muallif va manbasini yozing. Kompozitsiya, so‘z yoki sur’atdagi bittadan tanlovni tahlil qilib, usulni o‘z ishingizda sinang.",
      "Выберите десять работ. Укажите авторов и источники. Опишите один приём композиции, текста или темпа и попробуйте его в собственной работе.",
    ],
    finish: [
      "Ten source notes and one original experiment. Credit references; do not present copies as your work.",
      "O‘nta manba qaydi va bitta original sinov. Manbani ko‘rsating; nusxani o‘z ishingiz deb bermang.",
      "Десять заметок об источниках и один оригинальный опыт. Укажите источники, не выдавайте копии за свои работы.",
    ],
  },
  "creative:p1_t4": {
    steps: [
      "Select three pieces you made. For each, add its goal, your process and what you would revise. Arrange them in a document or folder with a short introduction.",
      "O‘zingiz yaratgan uchta ishni tanlang. Har biriga maqsad, jarayon va tuzatmoqchi bo‘lgan joyni yozing. Qisqa kirish bilan hujjat yoki papkaga joylang.",
      "Выберите три своих работы. Для каждой напишите цель, процесс и что улучшили бы. Соберите документ или папку с кратким вступлением.",
    ],
    finish: [
      "Someone else can open the collection and understand your contribution to each piece.",
      "Boshqa kishi to‘plamni ochib, har ishdagi hissangizni tushuna oladi.",
      "Другой человек может открыть подборку и понять ваш вклад в каждую работу.",
    ],
  },
  "science:p1_t1": {
    steps: [
      "Ask a safe, observable question, such as which paper shape falls more slowly. Write a prediction. Change only the shape, repeat each trial and record what happened.",
      "Qaysi qog‘oz shakli sekinroq tushadi kabi xavfsiz savol tanlang. Taxmin yozing. Faqat shaklni o‘zgartirib, sinovlarni takrorlang va natijani qayd eting.",
      "Задайте безопасный вопрос, например какая форма бумаги падает медленнее. Запишите предположение. Меняйте только форму, повторяйте испытания и фиксируйте результат.",
    ],
    finish: [
      "A question, prediction, observations and a conclusion that notes the experiment's limits.",
      "Savol, taxmin, kuzatuvlar va sinov chegaralarini ko‘rsatgan xulosa.",
      "Вопрос, предположение, наблюдения и вывод с ограничениями опыта.",
    ],
    resource: { name: "NASA: What Is Science?", url: "https://spaceplace.nasa.gov/science/en/" },
  },
  "science:p1_t2": {
    steps: [
      "Pick a topic and ask a teacher or librarian for five accessible research papers. Read their abstracts, methods and conclusions. Record each source, its question and one limitation; look up unfamiliar words.",
      "Mavzu tanlab, o‘qituvchi yoki kutubxonachidan tushunarli beshta maqola so‘rang. Annotatsiya, usul va xulosani o‘qing. Manba, savol va bittadan cheklovni yozing; yangi so‘zlarni izlang.",
      "Выберите тему и попросите учителя или библиотекаря помочь найти пять доступных статей. Прочитайте аннотации, методы и выводы. Запишите источник, вопрос и ограничение, разберите новые слова.",
    ],
    finish: [
      "Five sourced summaries in your own words and a question you still want to investigate.",
      "O‘z so‘zlaringizda beshta manbali xulosa va hali o‘rganmoqchi bo‘lgan savol.",
      "Пять пересказов своими словами со ссылками и вопрос для дальнейшего исследования.",
    ],
  },
  "science:p1_t3": {
    steps: [
      "Record ten observations, such as paper-drop times. Sort the values, calculate their mean and median, and draw a simple chart. Explain why a small sample cannot establish a general rule.",
      "Qog‘oz tushish vaqti kabi o‘nta kuzatuvni yozing. Tartiblang, o‘rtacha va medianani hisoblang, diagramma chizing. Kichik namuna umumiy qoida bermasligini tushuntiring.",
      "Запишите десять наблюдений, например время падения бумаги. Отсортируйте значения, найдите среднее и медиану, постройте график. Объясните ограничения малой выборки.",
    ],
    finish: [
      "A labelled data table, two checked calculations and a chart with a short interpretation.",
      "Nomlangan jadval, tekshirilgan ikkita hisob va qisqa izohli diagramma.",
      "Подписанная таблица, два проверенных расчёта и график с кратким объяснением.",
    ],
  },
};

export function ActivityGuide({
  task,
}: {
  task: Pick<RoadmapTask, "id" | "title" | "description">;
}) {
  const w = useWords();
  const { lang } = useI18n();
  const index = { en: 0, uz: 1, ru: 2 }[lang];
  const guide = GUIDES[task.id];
  return (
    <details className="activity-guide">
      <summary>{w("Open activity", "Faoliyatni ochish", "Открыть занятие")}</summary>
      <div>
        <h6>{w("What to do", "Nima qilish kerak", "Что сделать")}</h6>
        <p>
          {guide
            ? guide.steps[index]
            : w(
                `Write a concrete goal for “${task.title}”. Use the task description below to plan the work. Make or practice something, keep a record, and review what you learned.`,
                `“${task.title}” uchun aniq maqsad yozing. Quyidagi tavsif bilan ishni rejalang. Ish yarating yoki mashq qiling, qayd eting va o‘rganganingizni tahlil qiling.`,
                `Запишите конкретную цель для «${task.title}». Спланируйте работу по описанию ниже. Создайте или попробуйте что-то, сохраните результат и проанализируйте опыт.`,
              )}
        </p>
        {!guide && <p>{task.description}</p>}
        <h6>
          {w("Mark complete when", "Qachon bajarildi deb belgilash", "Когда отметить выполнение")}
        </h6>
        <p>
          {guide
            ? guide.finish[index]
            : w(
                "You have a saved example or dated notes showing the work described in this task. Explain what you tried, what happened and what you would change. This is your own completion record, not a certificate.",
                "Vazifadagi ishni ko‘rsatadigan namuna yoki sanali qayd bor. Sinaganingiz, natija va tuzatishlarni tushuntiring. Bu shaxsiy qayd, sertifikat emas.",
                "Есть сохранённый пример или записи с датой о работе из задания. Объясните опыт, результат и что изменили бы. Это личная отметка, не сертификат.",
              )}
        </p>
        {guide?.resource && (
          <a href={guide.resource.url} target="_blank" rel="noopener noreferrer">
            {guide.resource.name} ↗{" "}
            <span className="sr-only">
              {w("opens a new tab", "yangi oynada ochiladi", "откроется в новой вкладке")}
            </span>
          </a>
        )}
        <small>
          {w(
            "Instructions are here; complete the work in your own tools. Resource links open external sites, usually in English.",
            "Ko‘rsatmalar shu yerda; ishni o‘z vositalaringizda bajaring. Havolalar tashqi, odatda inglizcha saytlarga olib boradi.",
            "Инструкции здесь; выполняйте работу в своих инструментах. Ссылки ведут на внешние сайты, обычно на английском.",
          )}
        </small>
      </div>
    </details>
  );
}
