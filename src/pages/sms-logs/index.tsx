import { useEffect } from "react";
import {
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  MoreHorizontal,
} from "lucide-react";
import { useSmsStore } from "@/store/use-sms-store";
import { format } from "date-fns";

const SmsLogsPage = () => {
  const {
    logs,
    loading,
    page,
    totalPages,
    query,
    fetchLogs,
    setPage,
    setQuery,
  } = useSmsStore();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

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
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 text-white">
                <Mail size={20} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
                SMS
                <span className="text-indigo-600 dark:text-indigo-400">
                  Logs
                </span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              История отправленных уведомлений и системных сообщений
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Поиск по номеру или тексту..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm shadow-sm dark:text-slate-200 dark:placeholder:text-slate-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <Loader2
              className="animate-spin text-indigo-600 dark:text-indigo-400 mb-4"
              size={40}
            />
            <span className="text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase text-[10px]">
              Загрузка логов...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-5 hover:shadow-md dark:hover:shadow-indigo-900/10 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Sender/Recipient Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          log.isSuccess
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {log.isSuccess ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <AlertCircle size={24} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                            Recipient:
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {log.recipient}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1">
                            <User size={12} /> {log.sender}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {format(new Date(log.sendTime), "dd.MM.yyyy HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 md:px-10">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {log.message}
                      </p>
                    </div>

                    {/* Status Label */}
                    <div className="text-right shrink-0">
                      <div
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border inline-block ${
                          log.isSuccess
                            ? "border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10"
                            : "border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10"
                        }`}
                      >
                        {log.isSuccess ? "Sent" : "Failed"}
                      </div>
                      {!log.isSuccess && (
                        <p
                          className="text-[10px] text-red-400 dark:text-red-500 mt-2 max-w-50 truncate"
                          title={log.additionalMessage}
                        >
                          {log.additionalMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 transition-colors">
                Записей не найдено
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-4">
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
                          key={i}
                          className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-600"
                        >
                          <MoreHorizontal size={16} />
                        </div>
                      ) : (
                        <button
                          key={i}
                          onClick={() => setPage(p as number)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            page === p
                              ? "bg-indigo-600 dark:bg-indigo-500 text-white scale-110 shadow-indigo-100 dark:shadow-indigo-900/40"
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmsLogsPage;
