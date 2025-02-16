import { AppSidebar } from "@/components/shared/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <section className="flex h-screen overflow-hidden">
        <AppSidebar />
        <main className="w-full bg-sky-100 bg-opacity-90">
          <Outlet />
          <Toaster className="bg-sky-100 text-white" />
        </main>
      </section>
    </>
  );
}

export default RootLayout;
