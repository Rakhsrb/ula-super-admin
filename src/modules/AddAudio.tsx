import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fetch } from "@/middlewares/Fetch";

interface AddUnitSheetProps {
  collectionName: string | undefined;
  bookName: string | undefined;
  level: string | undefined;
  unitId: string;
}

const AddAudio = ({
  collectionName,
  bookName,
  level,
  unitId,
}: AddUnitSheetProps) => {
  const [audios, setAudios] = useState<{ file: File | null; label: string }[]>([
    { file: null, label: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addAudioField = () => {
    setAudios([...audios, { file: null, label: "" }]);
  };

  const updateAudioField = (
    index: number,
    field: "file" | "label",
    value: string | File | null
  ) => {
    setAudios((prevAudios) =>
      prevAudios.map((audio, i) =>
        i === index ? { ...audio, [field]: value } : audio
      )
    );
  };

  const handleSubmit = async () => {
    if (audios.some((audio) => !audio.file || !audio.label)) {
      return alert("Each audio must have a file and label!");
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      audios.forEach((audio, index) => {
        formData.append(`audios[${index}][file]`, audio.file as File);
        formData.append(`audios[${index}][label]`, audio.label);
      });

      await Fetch.post(
        `/collection/addAudio/${collectionName}/${bookName}/${level}/${unitId}`,
        formData
      );

      alert("Unit added successfully!");
      setAudios([{ file: null, label: "" }]);
    } catch (error) {
      console.error("Error adding unit:", error);
      alert("Failed to add unit!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Add Audios</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add Audios</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {audios.map((audio, index) => (
            <div key={index} className="space-y-2">
              <Input
                type="file"
                name="audios"
                accept="audio/*"
                onChange={(e) =>
                  updateAudioField(index, "file", e.target.files?.[0] || null)
                }
              />
              <Input
                placeholder="Audio Label"
                value={audio.label}
                onChange={(e) =>
                  updateAudioField(index, "label", e.target.value)
                }
              />
            </div>
          ))}

          <Button variant="outline" onClick={addAudioField} className="w-full">
            + More Audio
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Adding..." : "Add Audios"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAudio;
