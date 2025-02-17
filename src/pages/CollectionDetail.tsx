import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useSWR from "swr";

import { Fetch } from "@/middlewares/Fetch";
import { Link, useParams } from "react-router-dom";
import { CollectionTypes } from "@/types/RootTypes";
import { SquarePen, Trash } from "lucide-react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CollectionDetail = () => {
  const { collectionName } = useParams();
  const { data, error, isLoading, mutate } = useSWR<{ data: CollectionTypes }>(
    `http://localhost:8000/api/collection/${collectionName}`,
    fetcher
  );

  const [bookNameInput, setBookNameInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [bookId, setBookId] = useState<string | null>(null);
  const [editedBookName, setEditedBookName] = useState<string>("");

  const handleCreateBook = async () => {
    if (!bookNameInput.trim()) return;
    try {
      await Fetch.post("collection/createNewBook", {
        name: bookNameInput,
        collectionId: data?.data._id,
      });
      toast("Book has been created successfully!");
      setBookNameInput("");
      setIsModalOpen(false);
      mutate();
    } catch (error) {
      console.log("Error creating book:", error);
    }
  };

  const handleDeleteBook = async () => {
    if (!data?.data?._id || !bookId) return;
    try {
      await Fetch.delete(`collection/deleteBook/${collectionName}/${bookId}`);
      setIsEditModalOpen(false);
      mutate();
      toast("Book has been deleted successfully!");

    } catch (error) {
      console.log("Error deleting book:", error);
    }
  };

  const handleEditBook = async () => {
    if (!data?.data._id || !bookId) return;
    try {
      await Fetch.put(`data/editBook`, {
        collectionId: data.data._id,
        bookId,
        editedBookName,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating book name:", error);
    }
  };
  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Failed to load data. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="h-16 w-16 border-[6px] border-dotted border-sky-600 animate-spin rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-10 h-screen overflow-y-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={data?.data.collectionImage}
            alt={data?.data.collectionName}
          />
          <div className="p-8">
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-green-700 sm:text-4xl">
              {data?.data.collectionName}
            </h1>
            <p className="mt-4 text-xl">
              In this data{" "}
              <span className="text-sky-600">({data?.data.books.length})</span>{" "}
              books
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-sky-600">Books</h1>

      {data?.data.books.length == 0 ? (
        <h1 className="text-center text-white opacity-60">
          Books are not available
        </h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data?.data.books.map((book, index) => (
          <div
            key={index}
            className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Link
              to={`/collections/${data.data.collectionName}/${book.name}`}
              className="block relative overflow-hidden group"
            >
              <img
                src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149330605.jpg?semt=ais_hybrid"
                alt={book.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 hover:backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">
                  View Details
                </span>
              </div>
            </Link>
            <div className="p-4 space-y-4 bg-white">
              <h3 className="text-lg font-semibold text-sky-600">
                {book.name}
              </h3>
              <div className="flex flex-wrap justify-end gap-2">
                <Dialog
                  open={isEditModalOpen}
                  onOpenChange={setIsEditModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBookId(book._id);
                        setEditedBookName(book.name);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <SquarePen />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Book Name</DialogTitle>
                      <DialogDescription>
                        Make changes to the data type name here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        id="name"
                        placeholder="Enter new name..."
                        value={editedBookName}
                        onChange={(e) => setEditedBookName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleEditBook} type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setBookId(book._id)}
                    >
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the data type and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteBook}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center">
        <Button
          onClick={() => setIsModalOpen(true)}
          variant={"outline"}
          className="bg-sky-600 hover:bg-sky-500 hover:text-white text-white"
        >
          + New book
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] text-sky-600">
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Enter a name for your new data. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter data name..."
              value={bookNameInput}
              onChange={(e) => setBookNameInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateBook}
              type="submit"
              className="bg-sky-600"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionDetail;
