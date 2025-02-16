import {
  Users,
  PanelLeftOpen,
  PanelLeftClose,
  LogOut,
  UserCog,
  BookAudio,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const items = [
    {
      title: "Students",
      url: "/",
      icon: Users,
    },
    {
      title: "Admins",
      url: "/admins",
      icon: UserCog,
    },
    {
      title: "Books",
      url: "/collections",
      icon: BookAudio,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <aside
      style={{ transition: "all ease-in-out .3s" }}
      className={`bg-sky-600 text-white h-screen p-4 ${
        isSidebarOpen ? "w-[300px]" : "w-[60px]"
      }`}
    >
      <ul
        className={`flex flex-col gap-5 ${
          !isSidebarOpen ? "items-center" : ""
        }`}
      >
        {isSidebarOpen ? (
          <PanelLeftClose
            onClick={() =>
              setIsSidebarOpen((prevData) => (prevData ? false : true))
            }
          />
        ) : (
          <PanelLeftOpen
            onClick={() =>
              setIsSidebarOpen((prevData) => (prevData ? false : true))
            }
          />
        )}
        {items.map((item, index) => (
          <li key={index}>
            <Link
              to={item.url}
              className={`flex items-center gap-2 ${
                !isSidebarOpen ? "justify-center" : ""
              }`}
            >
              {<item.icon size={18} />}
              <span className={`${isSidebarOpen ? "" : "hidden"}`}>
                {item.title}
              </span>
            </Link>
          </li>
        ))}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <li
              className={`absolute bottom-5 cursor-pointer flex items-center gap-2 ${
                !isSidebarOpen ? "justify-center" : ""
              }`}
            >
              <LogOut size={18} />
              <span className={`${isSidebarOpen ? "" : "hidden"}`}>Выйти</span>
            </li>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#202020] border-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Вы точно хотите выйти?
              </AlertDialogTitle>
              <AlertDialogDescription>
                После выхода ваши данные будут утерены
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отменить</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Применить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ul>
    </aside>
  );
}
