import { useEffect, useState } from "react";
import { RootState } from "../store/RootStore";
import { useDispatch, useSelector } from "react-redux";
import { Fetch } from "../middlewares/Fetch";
import { StudentTypes } from "../types/RootTypes";
import {
  setStudents,
  setStudentsError,
  setStudentsPending,
} from "../toolkit/StudentsSlicer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, BadgeX, EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { AddStudent } from "@/modules/AddStudent";
import { Input } from "@/components/ui/input";

export default function Students() {
  const { isPending, data, error } = useSelector(
    (state: RootState) => state.students
  );
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        dispatch(setStudentsPending());
        const response = (await Fetch.get(`student?firstName=${searchTerm}`))
          .data;
        if (response) {
          dispatch(setStudents(response));
        } else {
          dispatch(setStudentsError(response.message));
        }
      } catch (error: any) {
        dispatch(
          setStudentsError(error.response?.data.message || "Unknown Token")
        );
      }
    }
    getData();
  }, [dispatch]);

  const handleDeleteAdmin = async (id: string) => {
    try {
      (await Fetch.delete(`student/${id}`)).data;
      dispatch(setStudents(data.filter((admin) => admin._id !== id)));
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((student: StudentTypes) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isPending) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="h-16 w-16 border-[6px] border-dotted border-sky-600 animate-spin rounded-full"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-lg font-medium text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex items-center gap-4">
          <Input
            className="bg-white"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Sheet>
            <AddStudent />
          </Sheet>
        </div>
      </div>

      {filteredData.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-sky-400">Нет ни одного студента</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((student: StudentTypes) => (
            <div
              key={student._id}
              className="bg-[#202020] rounded-lg p-4 flex flex-col gap-3 relative"
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute top-2 right-2">
                  <EllipsisVertical size={24} className="text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none">
                  <DropdownMenuItem
                    onClick={() => handleDeleteAdmin(student._id)}
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                  >
                    <Trash size={20} /> Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <h2 className="text-lg font-semibold truncate text-white">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-gray-300 text-sm">
                Number: {student.phoneNumber}
              </p>
              <p className="text-gray-300 text-sm">
                Joined: {student.createdAt.slice(0, 10)}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  Status:{" "}
                  {student.payment.status ? (
                    <BadgeCheck className="text-green-500" />
                  ) : (
                    <BadgeX className="text-red-500" />
                  )}
                </p>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  {student.payment.lastPaidDate.slice(0, 10)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
