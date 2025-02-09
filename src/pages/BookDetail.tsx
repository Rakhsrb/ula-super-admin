import { Fetch } from "@/middlewares/Fetch";
import type { BookTypes } from "@/types/RootTypes";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [book, setBook] = useState<BookTypes | null>(null);
  const { collectionName, bookName } = useParams();

  useEffect(() => {
    const getBookByName = async () => {
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

    getBookByName();
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
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        {book.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {book.levels.map((level) => (
          <Card
            key={level._id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>{level.level}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {level.units.map((unit) => (
                <div key={unit.title} className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">{unit.title}</h3>
                  <ul className="space-y-2">
                    {unit.audios.map((audio) => (
                      <li
                        key={audio.file}
                        className="flex items-center justify-between p-2 bg-secondary rounded-md"
                      >
                        <span className="text-sm">{audio.label}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-primary hover:text-primary-foreground hover:bg-primary"
                          onClick={() => {
                            const audioElement = new Audio(audio.file);
                            audioElement.play();
                          }}
                        >
                          <Play size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
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
