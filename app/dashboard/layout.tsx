import type { Metadata } from "next";
import { Sidebar, Header } from "@/components/dashboard";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Dashboard | Tio da Van",
  description: "Painel administrativo master do Tio da Van — gestão de motoristas, alunos e cobranças.",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return (
    <div className="dashboard-layout" id="dashboard-layout">
      <Sidebar />
      <Header />
      <main className="main">
        {children}
      </main>
    </div>
  );
}
