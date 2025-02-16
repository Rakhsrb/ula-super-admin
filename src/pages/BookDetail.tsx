import { Link, useParams } from "react-router-dom";
import type { BooksTypes } from "@/types/RootTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddNewUnit from "@/modules/AddNewUnit";
import { Sheet } from "@/components/ui/sheet";
import { AddLevel } from "@/modules/AddLevel";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const BookDetails = () => {
  const { collectionName, bookName } = useParams();
  const { data, error, isLoading, mutate } = useSWR<{ data: BooksTypes }>(
    `http://localhost:8000/api/collection/${collectionName}/${bookName}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="animate-spin text-primary h-10 w-10 border-4 border-dotted rounded-full border-white"></span>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center mt-10">{error}</div>;
  }

  if (!data?.data) {
    return <div className="text-center mt-10">No book data available.</div>;
  }

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-8 text-sky-600">
          {data.data.name}
        </h1>
        <Sheet>
          <AddLevel collectionName={collectionName!} bookId={data.data._id} />
        </Sheet>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.data.levels.map((level) => (
          <Card
            key={level._id}
            className="rounded-xl overflow-hidden border-none shadow-lg"
          >
            <CardHeader className="bg-sky-600 text-white">
              <CardTitle className="flex justify-between items-center">
                <h3 className="text-2xl">{level.level}</h3>
                <AddNewUnit
                  collectionName={collectionName!}
                  bookName={data.data.name}
                  levelId={level._id}
                  mutate={mutate}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[400px] max-h-[400px] overflow-y-auto">
              <ul>
                {level.units.map((unit, index) => (
                  <li
                    key={index}
                    className="mb-6 flex justify-between items-center border-2 p-2 rounded-lg border-sky-600 bg-sky-100 text-sky-600"
                  >
                    <h3 className="text-xl font-semibold">{unit.title}</h3>
                    <Link
                      to={`/units/${collectionName}/${bookName}/${level.level}/${unit._id}`}
                    >
                      Open
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
