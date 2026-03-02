import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    title: "დღის გაყიდვები",
    value: "₾ 12,450",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "შეკვეთები",
    value: "84",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    title: "პროდუქტები",
    value: "2,340",
    change: "-2.1%",
    trend: "down" as const,
    icon: Package,
  },
  {
    title: "მომხმარებლები",
    value: "1,245",
    change: "+5.4%",
    trend: "up" as const,
    icon: Users,
  },
];

const chartData = [
  { name: "ორშ", sales: 4200 },
  { name: "სამ", sales: 3800 },
  { name: "ოთხ", sales: 5100 },
  { name: "ხუთ", sales: 4600 },
  { name: "პარ", sales: 6200 },
  { name: "შაბ", sales: 7800 },
  { name: "კვი", sales: 5400 },
];

const recentSales = [
  { id: "#1042", customer: "გიორგი მ.", amount: "₾ 245.00", time: "2 წთ წინ" },
  { id: "#1041", customer: "ანა კ.", amount: "₾ 128.50", time: "15 წთ წინ" },
  { id: "#1040", customer: "დავით ბ.", amount: "₾ 89.00", time: "32 წთ წინ" },
  { id: "#1039", customer: "მარიამ ჯ.", amount: "₾ 312.75", time: "1 სთ წინ" },
  { id: "#1038", customer: "ნიკა წ.", amount: "₾ 67.20", time: "2 სთ წინ" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">მთავარი პანელი</h1>
        <p className="text-muted-foreground text-sm mt-1">მოგესალმებით, ადმინ. აქ არის დღევანდელი მიმოხილვა.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">კვირის გაყიდვები</h3>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">ბოლო 7 დღე</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215, 90%, 42%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(215, 90%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(215, 90%, 42%)"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">ბოლო გაყიდვები</h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              ყველა <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{sale.customer}</p>
                  <p className="text-xs text-muted-foreground">{sale.id} · {sale.time}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">{sale.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
