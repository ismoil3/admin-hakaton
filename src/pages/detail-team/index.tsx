"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Loader2,
  Users,
  MessageSquare,
  Crown,
  Send,
  FileText,
  AlertCircle,
  X,
  Info,
  CheckCircle2,
  Target,
  Lightbulb,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { useTeemStore } from "@/store/use-teams-store";
import toast from "react-hot-toast";

// ... (CASE_DETAILS бе тағйирот) ...
const CASE_DETAILS = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpNzCYn-SOFLque9taT_UwYdRpkwJrCEBnbQ&s",
    title: "AI Listing Studio (Somon.tj)",
    organizer: "Somon.tj",
    problem:
      "Создание объявлений занимает много времени, часто они неполные или неконсистентные, что снижает вовлеченность.",
    goal: "Разработать AI-помощника для быстрого и качественного создания объявлений (Недвижимость, Авто, Товары).",
    features: [
      "Vision: Извлечение характеристик из фото",
      "AI-копирайтер: Генерация заголовков и описаний",
      "Фото-коуч: Рекомендации по качеству фото",
      "Чеклист готовности к публикации",
    ],
    constraints: [
      "Не угадывать личные данные",
      "Не менять цены и не давать обещаний",
    ],
  },
  {
    img: "https://oriyonbonk.tj/_next/static/media/logo.a6a2c873.svg",
    title: "Smart Deposit Challenge",
    organizer: "Orienbank",
    problem:
      "Банковские калькуляторы скучные и не объясняют выгоду понятным языком.",
    goal: "Создать умного финансового помощника, который помогает выбрать стратегию накопления и объясняет расчеты.",
    features: [
      "Поддержка 3 типов вкладов (классический, с капитализацией, лестничный)",
      "AI объясняет разницу и дает рекомендации",
      "Визуализация выгоды",
    ],
    constraints: [
      "AI не считает проценты (это делает бэкенд), а только объясняет",
    ],
  },
  {
    img: "https://laklakmarket.tj/uploads/all/7mm0HfD0X5A8w91xscfaC6GunQPdP0Ll1b28rkqT.png",
    title: "LakLak AI Assistant",
    organizer: "LakLak Marketplace",
    problem: "Нагрузка на саппорт и низкая конверсия оплат заказов.",
    goal: "Виртуальный ассистент для автоматизации поддержки и помощи в завершении заказов.",
    features: [
      "Статус заказа и оплаты (после верификации)",
      "Напоминание о неоплаченных заказах",
      "Гид по доставке и правилам",
      "Ответы на FAQ",
    ],
    constraints: [
      "Языки: Русский и Таджикский",
      "Никаких выдумок, только данные маркетплейса",
    ],
  },
  {
    img: "https://cdn.stepik.net/media/cache/images/courses/128731/cover_f61hZEg/9ae47ad6d4c068af31b8a494c0397d54.jpg",
    title: "Прогнозирование оттока студентов",
    organizer: "Softclub CRM",
    problem: "Администраторы узнают об уходе студента слишком поздно.",
    goal: "AI-модуль, прогнозирующий риск ухода и рекомендующий действия.",
    features: [
      "ML-модель оценки риска (Низкий/Средний/Высокий)",
      "LLM для объяснения причин риска",
      "Рекомендации (звонок, встреча, напоминание)",
    ],
  },
  {
    img: "https://cdn.stepik.net/media/cache/images/courses/128731/cover_f61hZEg/9ae47ad6d4c068af31b8a494c0397d54.jpg",
    title: "AI-модуль отбора наставников",
    organizer: "Softclub CRM",
    problem:
      "Сложно быстро проверить тех. уровень и педагогические навыки ментора.",
    goal: "Модуль для стандартизированного тестирования и оценки менторов.",
    features: [
      "Проверка кода и теоретических знаний",
      "Оценка умения объяснять (Teaching skill)",
      "Автоматический отчет с рекомендацией (Green/Yellow/Red)",
    ],
  },
  {
    img: "https://yora.tj/_next/image?url=%2Flogo.webp&w=384&q=75",
    title: "Интеллектуальный подбор клиентов",
    organizer: "Yora.tj",
    problem: "Низкая конверсия и долгий ручной подбор клиентов.",
    goal: "AI-модуль для повышения конверсии и релевантности предложений.",
    features: [
      "Scoring модель релевантности (0-100)",
      "Объяснение, почему клиент подходит",
      "Рекомендация действия (письмо, звонок)",
    ],
  },
  {
    img: "https://oriyonbonk.tj/_next/static/media/logo.a6a2c873.svg",
    title: "AI Factoring Assistant",
    organizer: "Orienbank",
    problem: "Предприниматели не понимают факторинг и считают его сложным.",
    goal: "Чат-бот, который объясняет факторинг и рассчитывает условия.",
    features: [
      "Онбординг и расчет комиссии в чате",
      "Простой скоринг (Зеленый/Желтый/Красный)",
      "Объяснение условий простым языком",
    ],
    constraints: ["Использовать фиктивные данные", "Без сложных интеграций"],
  },
  {
    img: "https://it-park.tj/wp-content/uploads/2025/03/alif-tech.png",
    title: "Оценка стоимости жилья",
    organizer: "Alif Tech",
    problem: "Сложно определить адекватную рыночную цену квартиры.",
    goal: "ML-модель для предсказания цены на основе объявлений.",
    features: [
      "Предобработка данных (Somon.tj)",
      "Регрессионные модели (Linear, Random Forest, etc.)",
      "Анализ влияния признаков на цену",
    ],
  },
];

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTeam, fetchTeamById, loading, error, sendSmsToMembers } =
    useTeemStore();

  const [smsText, setSmsText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // State for Modal
  const [activeCaseModal, setActiveCaseModal] = useState<number | null>(null);

  useEffect(() => {
    if (id) fetchTeamById(id);
  }, [id, fetchTeamById]);

  // --- LOGIC CHANGE START: Find ALL selected cases, not just one ---
  const activeSolutions = useMemo(() => {
    if (!currentTeam || !currentTeam.stages) return [];

    // Map through all stages, combine with case details, then filter by content presence
    return currentTeam.stages
      .map((stage, index) => ({
        stage,
        caseDetail: CASE_DETAILS[index],
        index,
      }))
      .filter((item) => item.stage.content && item.stage.content.trim().length > 0);
  }, [currentTeam]);
  // --- LOGIC CHANGE END ---

  const handleSendToCaptain = async () => {
    const captain = currentTeam?.members.find((m) => m.isCapitan);

    if (!captain) {
      return toast.error("В этой команде не назначен капитан");
    }
    if (!smsText.trim()) {
      return toast.error("Введите текст сообщения");
    }

    setIsSending(true);
    const success = await sendSmsToMembers([captain.id], smsText);

    if (success) {
      toast.success(`SMS отправлено капитану: ${captain.fullName}`);
      setSmsText("");
    } else {
      toast.error("Ошибка при отправке");
    }
    setIsSending(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium tracking-wide">
          Загрузка команды...
        </span>
      </div>
    );

  if (error || !currentTeam)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 text-center transition-colors">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Команда не найдена
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all"
        >
          Назад
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {/* --- MODAL START --- */}
      {activeCaseModal !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveCaseModal(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCaseModal(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 p-2 flex items-center justify-center shadow-sm shrink-0">
                <img
                  src={CASE_DETAILS[activeCaseModal].img}
                  alt="logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">
                  Case #{activeCaseModal + 1}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {CASE_DETAILS[activeCaseModal].title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Организатор: {CASE_DETAILS[activeCaseModal].organizer}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Problem & Goal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
                  <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4" /> Проблема
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    {CASE_DETAILS[activeCaseModal].problem}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4" /> Цель
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    {CASE_DETAILS[activeCaseModal].goal}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Ключевой
                  функционал
                </h4>
                <ul className="space-y-2">
                  {CASE_DETAILS[activeCaseModal].features.map(
                    (feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Constraints */}
              {CASE_DETAILS[activeCaseModal].constraints && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                    Важные ограничения
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    {CASE_DETAILS[activeCaseModal].constraints?.map(
                      (con, idx) => (
                        <li key={idx}>{con}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveCaseModal(null)}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL END --- */}

      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            <span>К списку команд</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Участник Хакатона
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* HEADER */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-3">
            <Users size={14} /> Профиль команды
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {currentTeam.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Всего участников: {currentTeam.members.length}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN (Members & Solutions) - Takes 8/12 width */}
          <div className="lg:col-span-8 space-y-12">
            {/* 1. MEMBERS SECTION */}
            <section>
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <Users size={20} />
                </span>
                Состав команды
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTeam.members.map((member) => (
                  <div
                    key={member.id}
                    className={`group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all hover:shadow-lg dark:hover:shadow-indigo-900/10 ${member.isCapitan
                        ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/30"
                        : "border-slate-200 dark:border-slate-800"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold ${member.isCapitan
                            ? "bg-amber-100 text-amber-600"
                            : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {member.fullName[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            {member.fullName}
                          </h4>
                          {member.isCapitan && (
                            <Crown
                              size={14}
                              className="text-amber-500 fill-amber-500"
                            />
                          )}
                        </div>

                        <a
                          href={`tel:${member.phone}`}
                          className="text-sm text-slate-500 hover:text-indigo-600 block mb-3"
                        >
                          {member.phone}
                        </a>

                        <div className="flex gap-3">
                          {member.githubLink && (
                            <a
                              href={member.githubLink}
                              target="_blank"
                              className="text-slate-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                              <Github size={18} />
                            </a>
                          )}
                          {member.linkedinLink && (
                            <a
                              href={`https://${member.linkedinLink}`}
                              target="_blank"
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <Linkedin size={18} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {member.fullTimeParticipationNote && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                        <p className="text-xs text-slate-500 italic">
                          "{member.fullTimeParticipationNote}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 2. SOLUTIONS (ALL SELECTED CASES) */}
            <section>
              <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                  <FileText size={20} />
                </span>
                Решения кейсов
              </h3>

              {/* RENDER LIST OF SOLUTIONS */}
              {activeSolutions.length > 0 ? (
                <div className="space-y-8">
                  {activeSolutions.map((solItem) => (
                    <div
                      key={solItem.index}
                      className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500/20 dark:border-indigo-500/30 overflow-hidden shadow-xl shadow-indigo-500/5"
                    >
                      {/* Active Case Header */}
                      <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 px-6 py-5 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 border-b border-indigo-100 dark:border-indigo-900/50">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white rounded-2xl border border-indigo-100 p-2 flex items-center justify-center shrink-0 shadow-sm">
                            <img
                              src={solItem.caseDetail.img}
                              alt="logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                                Selected
                              </span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Case #{solItem.index + 1}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                              {solItem.caseDetail.title}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1">
                              {solItem.caseDetail.organizer}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveCaseModal(solItem.index)}
                          className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <Info size={16} />
                          Условия кейса
                        </button>
                      </div>

                      {/* The Solution Answer */}
                      <div className="p-8">
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                          <Terminal size={16} className="text-indigo-500" />
                          Техническое решение команды:
                        </h5>

                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative group">
                          <div className="absolute top-4 right-4 text-slate-300">
                            <FileText size={24} />
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                            {solItem.stage.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // FALLBACK IF NO SOLUTION FOUND
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Решение не найдено
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Эта команда зарегистрировалась, но еще не предоставила
                    описание решения ни для одного кейса.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN (Sidebar Actions) - Takes 4/12 width */}
          <div className="lg:col-span-4 space-y-6">
            {/* SMS WIDGET */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sticky top-24 shadow-sm">
              <h3 className="text-sm font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <MessageSquare size={16} /> Связь с капитаном
              </h3>

              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">
                  Отправить SMS уведомление на телефон капитана.
                </p>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Например: Подойдите к стойке менторов..."
                  className="w-full min-h-[120px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <button
                onClick={handleSendToCaptain}
                disabled={isSending}
                className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 disabled:opacity-70 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                Отправить SMS
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDetailPage;
