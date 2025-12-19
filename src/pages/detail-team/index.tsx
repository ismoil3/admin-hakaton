import  { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Phone,
  User,
  Loader2,
  Users,
  Calendar,
  Crown,
} from "lucide-react";
import { useTeemStore } from "@/store/use-teams-store";

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTeam, fetchTeamById, loading, error } = useTeemStore();

  useEffect(() => {
    if (id) fetchTeamById(id);
  }, [id, fetchTeamById]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
        <span className="text-slate-400 text-sm font-medium tracking-wide">
          Загрузка команды...
        </span>
      </div>
    );

  if (error || !currentTeam)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">
          Команда не найдена
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl"
        >
          Назад
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={18} />
            <span>Назад</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs uppercase tracking-widest mb-3">
            <Users size={14} /> Командный проект
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            {currentTeam.name}
          </h1>
        </header>

        <div className="grid  gap-10">
          {/* Members */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              Участники <span className="h-px flex-1 bg-slate-100" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTeam.members.map((member) => (
                <div
                  key={member.id}
                  className={`group relative bg-white p-5 rounded-2xl border transition-all hover:shadow-md ${
                    member.isCapitan
                      ? "border-amber-200 bg-amber-50/10 shadow-sm shadow-amber-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {/* Captain Badge */}
                  {member.isCapitan && (
                    <div className="absolute -top-3 -right-2 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg shadow-amber-200 uppercase tracking-tighter">
                      <Crown size={10} fill="white" /> Captain
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        member.isCapitan
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
                      }`}
                    >
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {member.fullName}
                      </h4>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                      >
                        <Phone size={10} /> {member.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    <a
                      href={member.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 flex justify-center bg-slate-50 hover:bg-slate-900 hover:text-white rounded-lg transition-all"
                    >
                      <Github size={16} />
                    </a>
                    <a
                      href={`https://${member.linkedinLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 flex justify-center bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                    >
                      <Linkedin size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
              <h3 className="text-sm font-bold uppercase text-indigo-400 mb-6 flex items-center gap-2">
                <Calendar size={16} /> Этапы работы
              </h3>
              <div className="space-y-5">
                {currentTeam.stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="relative pl-6 border-l border-white/10 pb-2"
                  >
                    <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-indigo-500" />
                    <p className="text-sm font-medium text-slate-200">
                      {stage.content}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">
                      Phase 0{idx + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDetailPage;
