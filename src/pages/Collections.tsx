import { useEffect, useState } from "react";
import { RootState } from "../store/RootStore";
import { useDispatch, useSelector } from "react-redux";
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
import {
  setCollectionsPending,
  setCollections,
  setCollectionsError,
} from "@/toolkit/CollectionSlicer";
import { AddNewCollection } from "@/modules/AddNewCollection";
import { Link } from "react-router-dom";
import { CollectionTypes } from "@/types/RootTypes";

export default function Collections() {
  const { isPending, data, error } = useSelector(
    (state: RootState) => state.collections
  );
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        dispatch(setCollectionsPending());
        const response = (await Fetch.get(`collection`)).data;
        if (response.data) {
          dispatch(setCollections(response.data));
        } else {
          dispatch(setCollectionsError(response.message));
        }
      } catch (error: any) {
        dispatch(
          setCollectionsError(error.response?.data.message || "Unknown Token")
        );
      }
    }
    getData();
  }, [dispatch]);

  const handleDeleteAdmin = async (id: string) => {
    try {
      (await Fetch.delete(`collection/${id}`)).data;
      dispatch(
        setCollections(data.filter((collection) => collection._id !== id))
      );
    } catch (error) {
      console.log(error);
    }
  };
  const filteredData = data.filter((collection: CollectionTypes) =>
    `${collection.collectionName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-white">Book Collections</h1>
        <div className="flex items-center gap-4">
          <Input
            className="bg-white"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            max={2}
          />
          <Sheet>
            <AddNewCollection />
          </Sheet>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
              className="animate-pulse bg-[#202020] rounded-lg p-4 flex flex-col gap-3"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-red-600">{error}</p>
        </div>
      ) : filteredData.length <= 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg font-medium text-gray-300">
            No collections found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredData.map(
            (
              { collectionImage, collectionName, _id }: CollectionTypes,
              index
            ) => (
              <div
                key={index}
                className="bg-[#202020] rounded-lg overflow-hidden flex flex-col gap-3 relative h-[300px]"
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
                      onClick={() => handleDeleteAdmin(_id)}
                      className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      <Trash size={20} /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  to={`/collections/${collectionName}`}
                  className="flex flex-col h-full gap-2"
                >
                  <img
                    src={collectionImage}
                    alt="no Image"
                    className="w-full h-full object-contain "
                  />
                  <h1 className="p-2 text-white">{collectionName}</h1>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
