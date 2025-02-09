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
  collectionName: string;
  bookId: string;
  levelId: string;
  onUnitAdded: () => void;
}

const AddNewUnit = ({
  collectionName,
  bookId,
  levelId,
  onUnitAdded,
}: AddUnitSheetProps) => {
  const [title, setTitle] = useState("");
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
    if (!title.trim()) return alert("Title is required!");
    if (!audios.some((audio) => audio.file && audio.label)) {
      return alert("At least one audio file and label is required!");
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);

      audios.forEach((audio, index) => {
        if (audio.file && audio.label) {
          formData.append(`audios[${index}][file]`, audio.file);
          formData.append(`audios[${index}][label]`, audio.label);
        }
      });

      await Fetch.post(
        `/collection/addUnit/${collectionName}/${bookId}/${levelId}`,
        formData
      );

      alert("Unit added successfully!");
      setTitle("");
      setAudios([{ file: null, label: "" }]);
      onUnitAdded();
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
        <Button variant="secondary">New Unit</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Unit</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Input
            placeholder="Unit Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {audios.map((audio, index) => (
            <div key={index} className="space-y-2">
              <Input
                type="file"
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
            + Add Audio
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Adding..." : "Add Unit"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewUnit;
