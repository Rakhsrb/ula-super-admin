import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Fetch } from "@/middlewares/Fetch";
import type { BookTypes } from "@/types/RootTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import AddNewUnit from "@/modules/AddNewUnit";

const BookDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [book, setBook] = useState<BookTypes | null>(null);
  const { collectionName, bookName } = useParams();

  const fetchBook = async () => {
    setIsLoading(true);
    try {
      const response = (
        await Fetch.get(`/collection/${collectionName}/${bookName}`)
      ).data;
      setBook(response.data);
    } catch (error: any) {
      setIsError("Failed to fetch collection details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [collectionName, bookName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin text-primary h-10 w-10 border-4 border-dotted rounded-full border-white"></span>
      </div>
    );
  }

  if (isError) {
    return <div className="text-destructive text-center mt-10">{isError}</div>;
  }

  if (!book) {
    return <div className="text-center mt-10">No book data available.</div>;
  }

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        {book.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {book.levels.map((level) => (
          <Card
            key={level._id}
            className="rounded-xl overflow-hidden border-none"
          >
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex justify-between items-center">
                <h3>{level.level}</h3>
                <AddNewUnit
                  collectionName={collectionName!}
                  bookId={book._id}
                  levelId={level._id}
                  onUnitAdded={fetchBook}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px] max-h-[400px] overflow-y-auto">
              {level.units.map((unit, index) => ( 
                <div key={index} className="mb-6 flex justify-between">
                  <h3 className="text-xl font-semibold mb-3">Unit {index + 1}</h3>
                  <Link to={`/units/${collectionName}/${bookName}/${level.level}/${unit._id}`}>
                    <Eye />
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
