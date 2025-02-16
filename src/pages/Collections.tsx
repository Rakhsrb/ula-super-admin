import { useState } from "react";
import { Fetch } from "../middlewares/Fetch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { AddNewCollection } from "@/modules/AddNewCollection";
import { Link } from "react-router-dom";
import { CollectionTypes } from "@/types/RootTypes";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Collections() {
  const { data, error, isLoading, mutate } = useSWR<{
    data: CollectionTypes[];
  }>(`http://localhost:8000/api/collection`, fetcher);

  const handleDeleteCollection = async (id: string) => {
    try {
      mutate(
        (prevData) =>
          prevData
            ? {
                ...prevData,
                data: prevData.data.filter(
                  (collection) => collection._id !== id
                ),
              }
            : prevData,
        false
      );
      (await Fetch.delete(`collection/deleteCollection/${id}`)).data;
    } catch (error) {
      console.log(error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data?.data?.filter((collection: CollectionTypes) =>
    `${collection.collectionName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="h-16 w-16 border-[6px] border-dotted border-sky-600 animate-spin rounded-full"></span>
      </div>
    );
  }

  if (error) {
    <div className="flex justify-center items-center h-40">
      <p className="text-lg font-medium text-red-600">{error}</p>
    </div>;
  }

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Book Collections</h1>
        <div className="flex items-center gap-4">
          <Input
            className="bg-white"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            max={2}
          />
          <Sheet>
            <AddNewCollection mutate={mutate} />
          </Sheet>
        </div>
      </div>

      {filteredData && filteredData?.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium">No collections found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredData?.map(
            (
              { collectionImage, collectionName, _id }: CollectionTypes,
              index
            ) => (
              <div
                key={index}
                className="bg-[#202020] rounded-lg overflow-hidden shadow-lg flex flex-col gap-3 relative h-[300px]"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute top-2 right-2">
                    <EllipsisVertical
                      size={24}
                      className="text-black bg-gray-100 rounded-full"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-none">
                    <DropdownMenuItem
                      onClick={() => handleDeleteCollection(_id)}
                      className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      <Trash size={20} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to={`/collections/${collectionName}`}
                  className="flex flex-col h-full gap-2 relative"
                >
                  <img
                    src={collectionImage}
                    alt="no Image"
                    className="w-full h-full object-cover"
                  />
                  <h1 className="p-2 text-white absolute bottom-0 left-0 bg-sky-600 w-full text-center">
                    {collectionName}
                  </h1>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
