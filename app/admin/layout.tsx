import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Car, Tag, FileText, Users, LogOut, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/faults", label: "Faults", icon: FileText },
  { href: "/admin/makes", label: "Makes", icon: Car },
  { href: "/admin/models", label: "Models", icon: Car },
  { href: "/admin/variants", label: "Variants", icon: Car },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/submissions", label: "Submissions", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen flex bg-[#F3F4F6]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#111827] text-white flex flex-col">
        <div className="px-4 py-5 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold text-[#CC0000]">CKF</Link>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <LogOut size={14} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
