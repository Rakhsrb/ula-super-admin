import { AppSidebar } from "@/components/shared/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <section className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="w-full bg-[#333533] bg-opacity-90">
          <Outlet />
          <Toaster className="bg-[#333533] text-white" />
        </main>
      </section>
    </>
  );
}

export default RootLayout;
