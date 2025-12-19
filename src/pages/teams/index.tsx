import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Добавили навигацию
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
} from "lucide-react";
import { useTeemStore } from "@/store/use-teams-store";

const TeamPage = () => {
  const navigate = useNavigate();
  const {
    teams,
    loading,
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
  }, [page, query]); // Добавляем зависимости для обновления при поиске/пагинации

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Users className="text-white" size={20} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800">
                TEAM<span className="text-indigo-600">HUB</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Мониторинг и управление{" "}
              <span className="text-slate-800 font-bold underline decoration-indigo-200 underline-offset-4">
                участниками хакатона
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Поиск команды..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* View Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {[
                { id: "table", icon: List },
                { id: "card", icon: LayoutGrid },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === mode.id
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <mode.icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <span className="text-slate-400 font-bold tracking-widest uppercase text-[10px]">
              Загрузка данных...
            </span>
          </div>
        ) : (
          <>
            {viewMode === "table" ? (
              /* TABLE VIEW */
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Команда
                      </th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Участники
                      </th>
                      <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Действие
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teams.map((team) => (
                      <tr
                        key={team.id}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {team.name.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-700">
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                            {team.count} чел.
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button
                            onClick={() => navigate(`/teams/${team.id}`)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors"
                          >
                            Просмотр
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* CARD GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    className="cursor-pointer bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all group relative flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          Active
                        </div>
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 4).map((m: any, i: number) => (
                            <div
                              key={i}
                              title={m.fullName}
                              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                                m.isCapitan
                                  ? "bg-amber-500 z-10"
                                  : "bg-slate-400"
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
                      <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-slate-400 text-xs font-medium mb-6">
                        Проект включает {team.count} участников.
                      </p>
                    </div>

                    <div className="flex items-center text-indigo-600 text-xs font-bold uppercase tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      Open details <ExternalLink size={14} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                          page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
