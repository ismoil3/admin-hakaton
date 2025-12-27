import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/use-auth-store";
import { Loader2, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(phone, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card border border-border rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-primary/5">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Admin Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Authenticate to access dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive text-sm font-medium flex items-center gap-3">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-xs uppercase font-bold text-muted-foreground tracking-widest ml-1"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="text"
                placeholder="901010101"
                className="h-12 rounded-xl bg-muted/30 border-border/60 focus:bg-background transition-all font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase font-bold text-muted-foreground tracking-widest ml-1"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 rounded-xl bg-muted/30 border-border/60 focus:bg-background transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <>
                  Sign In{" "}
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 opacity-60">
          &copy; 2025 Hackathon Administration System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
