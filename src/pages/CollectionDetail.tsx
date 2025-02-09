import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
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
import { AddLevel } from "@/modules/AddLevel";
import type { CollectionTypes } from "@/types/RootTypes";

import { Fetch } from "@/middlewares/Fetch";
import { Link, useParams } from "react-router-dom";

const CollectionDetail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [collection, setCollection] = useState<CollectionTypes | null>(null);
  const [bookNameInput, setBookNameInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [bookId, setBookId] = useState<string | null>(null);
  const [editedBookName, setEditedBookName] = useState<string>("");
  const { collectionName } = useParams();

  useEffect(() => {
    const getCollectionByName = async () => {
      setIsLoading(true);
      try {
        const response = (await Fetch.get(`/collection/${collectionName}`))
          .data;
        setCollection(response.data);
      } catch (error: any) {
        setIsError("Failed to fetch collection details.");
      } finally {
        setIsLoading(false);
      }
    };

    getCollectionByName();
  }, [collectionName]);

  const handleCreateBook = async () => {
    if (!bookNameInput.trim()) return;

    const formData = {
      name: bookNameInput,
      collectionId: collection?._id,
    };

    try {
      const response = await Fetch.post("collection/createNewBook", formData);
      console.log("Collection created successfully!", response.data);
      setBookNameInput("");
      setIsModalOpen(false);
    } catch (error) {
      console.log("Error creating collection:", error);
    }
  };

  const handleDeleteBook = async () => {
    if (!collection?._id || !bookId) return;
    try {
      await Fetch.delete(`collection/deleteBook/${collection._id}/${bookId}`);
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error deleting collection type:", error);
    }
  };

  const handleEditBook = async () => {
    if (!collection?._id || !bookId) return;
    try {
      await Fetch.put(`collection/editBook`, {
        collectionId: collection._id,
        bookId,
        editedBookName,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.log("Error updating book name:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin text-white h-10 w-10 border-4 border-dotted border-white rounded-full"></span>
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive text-center mt-10">{isError}</div>;
  }

  return (
    <div className="p-4 space-y-10 h-screen overflow-y-auto">
      <div className="bg-[#202020] shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={collection?.collectionImage}
            alt={collection?.collectionName}
          />
          <div className="p-8">
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-green-700 sm:text-4xl">
              {collection?.collectionName}
            </h1>
            <p className="mt-4 text-xl text-white">
              In this collection{" "}
              <span className="text-sky-600">{collection?.books.length}</span>{" "}
              books
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white">Books</h1>

      {collection?.books.length == 0 ? (
        <h1 className="text-center text-white opacity-60">
          Books are not available
        </h1>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {collection?.books.map((book, index) => (
          <div
            key={index}
            className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Link
              to={`/collections/${collection.collectionName}/${book.name}`}
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
            <div className="p-4 space-y-4 bg-[#202020]">
              <h3 className="text-lg font-semibold text-white">{book.name}</h3>
              <div className="flex flex-wrap justify-end gap-2">
                <Sheet>
                  <AddLevel collectionId={collection._id} bookId={book._id} />
                </Sheet>
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
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Book Type Name</DialogTitle>
                      <DialogDescription>
                        Make changes to the collection type name here. Click
                        save when you're done.
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
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the collection type and remove all associated
                        data.
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
        <Button onClick={() => setIsModalOpen(true)} variant={"outline"}>
          + New book
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Enter a name for your new collection. Click create when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Enter collection name..."
              value={bookNameInput}
              onChange={(e) => setBookNameInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateBook} type="submit">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionDetail;
