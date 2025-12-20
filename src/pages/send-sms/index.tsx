import  { useState, useEffect } from "react";
import {
  Search,
  Send,
  Users,
  MessageSquare,
  Check,
  Loader2,
  Crown,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { useTeemStore } from "@/store/use-teams-store";
import toast from "react-hot-toast";

const SmsSendPage = () => {
  const {
    teams,
    loading,
    fetchTeams,
    query,
    setQuery,
    sendSmsToMembers,
    error,
  } = useTeemStore();

  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [smsText, setSmsText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState(query);

  // 1. Debounce для поиска
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, setQuery]);

  useEffect(() => {
    fetchTeams();
  }, [query, fetchTeams]);

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const selectAllVisible = () => {
    if (selectedTeamIds.length === teams.length) {
      setSelectedTeamIds([]);
    } else {
      setSelectedTeamIds(teams.map((t) => t.id));
    }
  };

  const handleSend = async () => {
    if (selectedTeamIds.length === 0)
      return toast.error("Выберите хотя бы одну команду");
    if (!smsText.trim()) return toast.error("Введите текст сообщения");

    setIsSending(true);

    try {
      const captainIds = teams
        .filter((team) => selectedTeamIds.includes(team.id))
        .map((team) => team.members.find((m) => m.isCapitan)?.id)
        .filter((id): id is string => !!id);

      if (captainIds.length === 0) {
        throw new Error("В выбранных командах не найдены капитаны");
      }

      const success = await sendSmsToMembers(captainIds, smsText);

      if (success) {
        toast.success(
          `Сообщение успешно отправлено ${captainIds.length} капитанам`
        );
        setSmsText("");
        setSelectedTeamIds([]);
      } else {
        throw new Error("Сервер отклонил запрос на отправку");
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка при отправке");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-white p-6 md:p-10 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ЛЕВАЯ ЧАСТЬ: ВЫБОР КОМАНД */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex bg-white dark:bg-[#161B22] p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
              <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-md">
                Teams
              </button>
            </div>
            <button
              onClick={selectAllVisible}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-all"
            >
              {selectedTeamIds.length === teams.length && teams.length > 0 ? (
                <CheckSquare size={18} />
              ) : (
                <Square size={18} />
              )}
              {selectedTeamIds.length === teams.length && teams.length > 0
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search teams by name..."
              className="w-full bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-10 outline-none focus:border-indigo-500 shadow-sm transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && (
              <Loader2
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-indigo-500"
                size={20}
              />
            )}
          </div>

          {/* Teams List Area */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar min-h-[300px]">
            {error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-bold">Error loading teams</p>
                <p className="text-sm opacity-70">{error}</p>
                <button
                  onClick={() => fetchTeams()}
                  className="mt-4 text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : teams.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-[#161B22] rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
                <Users size={48} className="mb-4 opacity-20" />
                <p>No teams found</p>
              </div>
            ) : (
              teams.map((team) => {
                const captain = team.members.find((m) => m.isCapitan);
                const isSelected = selectedTeamIds.includes(team.id);

                return (
                  <div
                    key={team.id}
                    onClick={() => toggleTeamSelection(team.id)}
                    className={`group relative flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/5 shadow-md"
                        : "border-slate-200 dark:border-white/5 bg-white dark:bg-[#161B22] hover:border-indigo-300 dark:hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-[#0B0E14] text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        <Users size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                          {team.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 font-semibold">
                            <Crown size={12} fill="currentColor" />{" "}
                            {captain?.fullName || "No Captain"}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                            {team.count} Members
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600"
                          : "border-slate-300 dark:border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: ФОРМА ОТПРАВКИ */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sticky top-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
              <MessageSquare className="text-indigo-500" /> SMS Text
            </h2>

            <div className="space-y-6">
              <div className="relative">
                <textarea
                  placeholder="Type your message here..."
                  className="w-full bg-slate-50 dark:bg-[#0B0E14] border border-slate-200 dark:border-white/5 rounded-3xl p-6 min-h-[250px] outline-none focus:border-indigo-500 transition-all resize-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                />
                <div
                  className={`absolute bottom-4 right-6 text-[10px] font-black uppercase tracking-widest ${
                    smsText.length > 160 ? "text-red-500" : "text-slate-400"
                  }`}
                >
                  {smsText.length} Characters{" "}
                  {smsText.length > 160 && "(Long Message)"}
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={
                  isSending || selectedTeamIds.length === 0 || !smsText.trim()
                }
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 dark:shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isSending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} /> Send SMS
                  </>
                )}
              </button>

              {selectedTeamIds.length > 0 && (
                <p className="text-center text-[10px] text-slate-400 uppercase font-bold">
                  Will be sent to {selectedTeamIds.length} captains
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsSendPage;
