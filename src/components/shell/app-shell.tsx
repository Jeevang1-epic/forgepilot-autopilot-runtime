import type { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#050608] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="absolute right-[-12rem] top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-300/8 blur-3xl" />
        <div className="absolute bottom-[-18rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_5rem] opacity-20" />
      </div>

      <Sidebar />

      <div className="relative flex min-h-dvh flex-col lg:pl-72">
        <Topbar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
