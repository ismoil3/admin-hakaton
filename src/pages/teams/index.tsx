import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  LayoutGrid,
  List,
  Loader2,
  ExternalLink,
  Crown,
  MoreHorizontal,
  AlertCircle,
  RefreshCw,
  Target, // Илова шуд
} from "lucide-react";
import { useTeemStore } from "@/store/use-teams-store";

// 1. Маълумоти мухтасар дар бораи Кейсҳо (Барои нишон додан дар рӯйхат)
const CASE_INFO = [
  {
    title: "AI Listing Studio",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpNzCYn-SOFLque9taT_UwYdRpkwJrCEBnbQ&s",
  },
  {
    title: "Smart Deposit",
    img: "https://oriyonbonk.tj/_next/static/media/logo.a6a2c873.svg",
  },
  {
    title: "LakLak Assistant",
    img: "https://laklakmarket.tj/uploads/all/7mm0HfD0X5A8w91xscfaC6GunQPdP0Ll1b28rkqT.png",
  },
  {
    title: "Churn Prediction",
    img: "https://cdn.stepik.net/media/cache/images/courses/128731/cover_f61hZEg/9ae47ad6d4c068af31b8a494c0397d54.jpg",
  },
  {
    title: "Mentor Selection",
    img: "https://cdn.stepik.net/media/cache/images/courses/128731/cover_f61hZEg/9ae47ad6d4c068af31b8a494c0397d54.jpg",
  },
  {
    title: "Client Matching",
    img: "https://yora.tj/_next/image?url=%2Flogo.webp&w=384&q=75",
  },
  {
    title: "Factoring AI",
    img: "https://oriyonbonk.tj/_next/static/media/logo.a6a2c873.svg",
  },
  {
    title: "House Pricing",
    img: "https://it-park.tj/wp-content/uploads/2025/03/alif-tech.png",
  },
];

const TeamPage = () => {
  const navigate = useNavigate();
  const {
    teams,
    loading,
    error,
    page,
    totalPages,
    query,
    fetchTeams,
    setPage,
    setQuery,
  } = useTeemStore();

  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  useEffect(() => {
    fetchTeams();
  }, [page, query, fetchTeams]);

  // Логика барои ёфтани кейси интихобшуда
  const getTeamCase = (team: any) => {
    if (!team.stages) return null;
    const index = team.stages.findIndex(
      (s: any) => s.content && s.content.trim().length > 0
    );
    if (index !== -1 && CASE_INFO[index]) {
      return { ...CASE_INFO[index], id: index + 1 };
    }
    return null;
  };

  const getPaginationRange = () => {
    const range = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-10 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
                TEAMS
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Мониторинг и управление{" "}
              <span className="text-slate-800 dark:text-slate-200 font-bold underline decoration-indigo-200 dark:decoration-indigo-500 underline-offset-4">
                участниками хакатона
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Поиск команды..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-slate-200 dark:placeholder:text-slate-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(["table", "card"] as const).map((modeId) => {
                const Icon = modeId === "table" ? List : LayoutGrid;
                return (
                  <button
                    key={modeId}
                    onClick={() => setViewMode(modeId)}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === modeId
                        ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <Loader2
              className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4"
              size={40}
            />
            <span className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase text-[10px]">
              Загрузка данных...
            </span>
          </div>
        ) : error ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 shadow-sm p-8 text-center transition-colors">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Произошла ошибка
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              {error}
            </p>
            <button
              onClick={() => fetchTeams()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
            >
              <RefreshCw size={18} />
              Попробовать снова
            </button>
          </div>
        ) : teams.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center mb-4">
              <Search size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Ничего не найдено
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              По запросу "{query}" не найдено ни одной команды
            </p>
            <button
              onClick={() => setQuery("")}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <>
            {viewMode === "table" ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-500 transition-colors">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Команда
                      </th>
                      {/* Сутуни нав барои кейс */}
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Проект (Кейс)
                      </th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                        Участники
                      </th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">
                        Действие
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {teams.map((team) => {
                      const activeCase = getTeamCase(team);

                      return (
                        <tr
                          key={team.id}
                          className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                {team.name.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">
                                {team.name}
                              </span>
                            </div>
                          </td>
                          {/* Нишон додани кейс дар ҷадвал */}
                          <td className="px-8 py-5">
                            {activeCase ? (
                              <div className="flex items-center gap-3">
                                <img
                                  src={activeCase.img}
                                  alt=""
                                  className="w-6 h-6 object-contain rounded-md bg-white border border-slate-100"
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    {activeCase.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    Case #{activeCase.id}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Не выбрано
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold">
                              {team.count} чел.
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => navigate(`/teams/${team.id}`)}
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold transition-colors"
                            >
                              Просмотр
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {teams.map((team) => {
                  const activeCase = getTeamCase(team);

                  return (
                    <div
                      key={team.id}
                      onClick={() => navigate(`/teams/${team.id}`)}
                      className="cursor-pointer bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all group relative flex flex-col justify-between min-h-[220px]"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                            Active
                          </div>
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 4).map((m: any, i: number) => (
                              <div
                                key={i}
                                title={m.fullName}
                                className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                  m.isCapitan
                                    ? "bg-amber-500 z-10"
                                    : "bg-slate-400 dark:bg-slate-600"
                                }`}
                              >
                                {m.isCapitan ? (
                                  <Crown size={12} fill="white" />
                                ) : (
                                  m.fullName.charAt(0)
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {team.name}
                        </h3>

                        {/* Нишон додани Кейс дар Карточка */}
                        <div className="mt-4 mb-2">
                            {activeCase ? (
                                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/30">
                                    <img src={activeCase.img} className="w-5 h-5 object-contain" alt="" />
                              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">{activeCase.title}</span>
                              {activeCase.id && (
                                  <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                                      Case #{activeCase.id}
                                  </span>
                              )}
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <Target size={14} className="text-slate-400"/>
                                    <span className="text-xs font-medium text-slate-400">Кейс не выбран</span>
                                </div>
                            )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                         <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                          {team.count} участников
                        </p>
                        <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            Details <ExternalLink size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-20 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-2">
                    {getPaginationRange().map((p, i) =>
                      p === "..." ? (
                        <div
                          key={`dots-${i}`}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-600"
                        >
                          <MoreHorizontal size={16} />
                        </div>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            page === p
                              ? "bg-indigo-600 dark:bg-indigo-500 text-white scale-110"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl disabled:opacity-20 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Страница {page} из {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
