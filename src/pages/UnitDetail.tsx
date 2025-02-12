import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fetch } from "@/middlewares/Fetch";
import type { Unit } from "@/types/RootTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import AddAudio from "@/modules/AddAudio";

const UnitDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<string>("");
  const [unit, setUnit] = useState<Unit | null>(null);
  const { collectionName, bookName, level, unitId } = useParams();

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const response = (
        await Fetch.get(
          `/collection/${collectionName}/${bookName}/${level}/${unitId}`
        )
      ).data;
      setUnit(response.data);
    } catch (error: any) {
      setIsError("Failed to fetch collection details.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUnits();
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

  if (!unit) {
    return <div className="text-center mt-10">No book data available.</div>;
  }

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-white flex items-center justify-between">
        {unit.title}
        <Sheet>
          <AddAudio
            unitId={unit._id}
            bookName={bookName}
            collectionName={collectionName}
            level={level}
          />
        </Sheet>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {unit.audios.map((audio, index) => (
          <Card key={index} className="rounded-xl overflow-hidden border-none">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex justify-between items-center">
                <h3>{audio.label}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 h-[400px] max-h-[400px] overflow-y-auto">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UnitDetails;
