import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Warehouse, Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center"
        style={{ background: "var(--gradient-dark)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-[120px]" />
        </div>

        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Warehouse className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sidebar-accent-foreground">WareFlow</h1>
              <p className="text-sm text-sidebar-foreground">Enterprise POS & Warehouse</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-sidebar-accent-foreground mb-4 leading-tight">
            საწყობისა და გაყიდვების <br />
            <span className="text-primary">ერთიანი პლატფორმა</span>
          </h2>
          <p className="text-sidebar-foreground leading-relaxed">
            მართეთ თქვენი საწყობი, გაყიდვები და ანალიტიკა ერთი სისტემიდან. 
            პროფესიონალური გადაწყვეტილება საცალო და საბითუმო ბიზნესისთვის.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { value: "500+", label: "კომპანია" },
              { value: "50K+", label: "პროდუქტი" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-sidebar-accent-foreground">{stat.value}</p>
                <p className="text-sm text-sidebar-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">WareFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">სისტემაში შესვლა</h2>
            <p className="text-muted-foreground mt-1">შეიყვანეთ თქვენი მონაცემები</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">ელ. ფოსტა</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.ge"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">პაროლი</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  დაგავიწყდათ?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                დამახსოვრება
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-medium">
              შესვლა
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            © 2026 WareFlow. ყველა უფლება დაცულია.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
