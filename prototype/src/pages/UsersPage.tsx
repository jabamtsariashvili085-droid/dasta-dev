import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Users as UsersIcon, Shield, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type AppRole = "admin" | "moderator" | "user";

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: AppRole;
  status: "active" | "inactive";
  createdAt: string;
}

const roleConfig: Record<AppRole, { label: string; icon: React.ElementType; className: string }> = {
  admin: { label: "ადმინი", icon: ShieldCheck, className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
  moderator: { label: "მოდერატორი", icon: Shield, className: "bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20" },
  user: { label: "მომხმარებელი", icon: User, className: "bg-muted text-muted-foreground border-border hover:bg-muted/80" },
};

const initialUsers: UserRecord[] = [
  { id: "1", fullName: "გიორგი ბერიძე", email: "giorgi@wareflow.ge", phone: "+995 555 12 34 56", role: "admin", status: "active", createdAt: "2026-01-15" },
  { id: "2", fullName: "ნინო კვარაცხელია", email: "nino@wareflow.ge", phone: "+995 555 23 45 67", role: "moderator", status: "active", createdAt: "2026-01-20" },
  { id: "3", fullName: "დავით მაისურაძე", email: "davit@wareflow.ge", phone: "+995 555 34 56 78", role: "user", status: "active", createdAt: "2026-02-01" },
  { id: "4", fullName: "მარიამ ჯავახიშვილი", email: "mariam@wareflow.ge", phone: "+995 555 45 67 89", role: "user", status: "active", createdAt: "2026-02-10" },
  { id: "5", fullName: "ლევან გოგოლაძე", email: "levan@wareflow.ge", phone: "+995 555 56 78 90", role: "user", status: "inactive", createdAt: "2026-02-15" },
  { id: "6", fullName: "ანა წიკლაური", email: "ana@wareflow.ge", phone: "+995 555 67 89 01", role: "moderator", status: "active", createdAt: "2026-02-20" },
];

const emptyForm = { fullName: "", email: "", phone: "", role: "user" as AppRole, status: "active" as "active" | "inactive" };

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filtered = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const openAdd = () => { setEditingUser(null); setForm(emptyForm); setDialogOpen(true); };

  const openEdit = (user: UserRecord) => {
    setEditingUser(user);
    setForm({ fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, status: user.status });
    setDialogOpen(true);
  };

  const openDelete = (user: UserRecord) => { setDeletingUser(user); setDeleteDialogOpen(true); };

  const handleSave = () => {
    if (!form.fullName || !form.email) {
      toast({ title: "შეცდომა", description: "გთხოვთ შეავსოთ სახელი და ელფოსტა", variant: "destructive" });
      return;
    }
    if (editingUser) {
      setUsers((prev) => prev.map((u) => u.id === editingUser.id ? { ...u, ...form } : u));
      toast({ title: "წარმატება", description: "მომხმარებელი განახლდა" });
    } else {
      setUsers((prev) => [...prev, { ...form, id: Date.now().toString(), createdAt: new Date().toISOString().split("T")[0] }]);
      toast({ title: "წარმატება", description: "მომხმარებელი დაემატა" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingUser) {
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      toast({ title: "წარმატება", description: "მომხმარებელი წაიშალა" });
    }
    setDeleteDialogOpen(false);
    setDeletingUser(null);
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">მომხმარებლები</h1>
          <p className="text-muted-foreground text-sm">მართეთ მომხმარებლები და როლები</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" />დამატება</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">სულ მომხმარებელი</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">აქტიური</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-emerald-600">{stats.active}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">ადმინისტრატორი</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.admins}</p></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="ძებნა..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="როლი" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ყველა როლი</SelectItem>
            <SelectItem value="admin">ადმინი</SelectItem>
            <SelectItem value="moderator">მოდერატორი</SelectItem>
            <SelectItem value="user">მომხმარებელი</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>მომხმარებელი</TableHead>
              <TableHead>ტელეფონი</TableHead>
              <TableHead>როლი</TableHead>
              <TableHead>სტატუსი</TableHead>
              <TableHead>რეგისტრაცია</TableHead>
              <TableHead className="text-right">მოქმედება</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <UsersIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">მომხმარებლები ვერ მოიძებნა</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => {
                const rc = roleConfig[user.role];
                const RoleIcon = rc.icon;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted">{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={rc.className}>
                        <RoleIcon className="w-3 h-3 mr-1" />{rc.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "outline"}
                        className={user.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20" : ""}>
                        {user.status === "active" ? "აქტიური" : "არააქტიური"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(user)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(user)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">სულ: {filtered.length} მომხმარებელი</p>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "მომხმარებლის რედაქტირება" : "ახალი მომხმარებელი"}</DialogTitle>
            <DialogDescription>{editingUser ? "შეცვალეთ მომხმარებლის ინფორმაცია" : "შეავსეთ ახალი მომხმარებლის მონაცემები"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>სრული სახელი *</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="სახელი გვარი" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>ელფოსტა *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="grid gap-2">
                <Label>ტელეფონი</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+995 555 XX XX XX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>როლი</Label>
                <Select value={form.role} onValueChange={(v: AppRole) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">ადმინი</SelectItem>
                    <SelectItem value="moderator">მოდერატორი</SelectItem>
                    <SelectItem value="user">მომხმარებელი</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>სტატუსი</Label>
                <Select value={form.status} onValueChange={(v: "active" | "inactive") => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">აქტიური</SelectItem>
                    <SelectItem value="inactive">არააქტიური</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>გაუქმება</Button>
            <Button onClick={handleSave}>{editingUser ? "განახლება" : "დამატება"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>მომხმარებლის წაშლა</AlertDialogTitle>
            <AlertDialogDescription>
              დარწმუნებული ხართ, რომ გსურთ <strong>{deletingUser?.fullName}</strong>-ის წაშლა? ეს მოქმედება შეუქცევადია.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>გაუქმება</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">წაშლა</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
