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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FormData = {
    title:title
  }

  

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required!");
    
    setIsSubmitting(true);
    try {
      await Fetch.post(
        `/collection/addUnit/${collectionName}/${bookId}/${levelId}`,
        FormData
      );
      alert("Unit added successfully!");
      setTitle("");
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
