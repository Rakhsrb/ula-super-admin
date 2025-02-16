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
  mutate: any;
}

const AddAudio = ({
  collectionName,
  bookName,
  level,
  unitId,
  mutate,
}: AddUnitSheetProps) => {
  const [audio, setAudio] = useState<{ file: File | null; label: string }>({
    file: null,
    label: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAudio({ ...audio, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAudio({ ...audio, file: file });
  };

  const handleSubmit = async () => {
    if (!audio.file) {
      alert("Please select an audio file!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("audio", audio.file);
      formData.append("label", audio.label);

      await Fetch.post(
        `collection/addAudio/${collectionName}/${bookName}/${level}/${unitId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Audio added successfully!");
      setAudio({ file: null, label: "" });
      mutate();
    } catch (error) {
      console.error("Error adding audio:", error);
      alert("Failed to add audio!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="bg-sky-600">
          Add Audios
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-[400px] text-sky-600">
        <SheetHeader>
          <SheetTitle className="text-sky-600">Add Audios</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Audio Label"
              name="label"
              value={audio.label}
              onChange={handleInputChange}
            />
            <Input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleFileChange}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-sky-600"
          >
            {isSubmitting ? "Adding..." : "Add Audios"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddAudio;
