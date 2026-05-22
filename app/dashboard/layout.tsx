"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar, Header } from "@/components/dashboard";
import "./dashboard.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  const pathname = usePathname();
  // Bypass Sidebar and Header for mobile parent/driver single screens
  const isMobileView = pathname.includes("/dashboard/pai") || pathname.includes("/dashboard/motorista");

  if (isMobileView) {
    return <>{children}</>;
  }

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

