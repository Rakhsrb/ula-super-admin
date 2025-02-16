import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";

export function AddLevel({
  collectionName,
  bookId,
}: {
  collectionName: string;
  bookId: string;
}) {
  const Options: { title: string }[] = [
    {
      title: "A1",
    },
    {
      title: "A2",
    },
    {
      title: "B1",
    },
    {
      title: "B2",
    },
    {
      title: "C1",
    },
    {
      title: "C2",
    },
  ];

  const [formData, setFormData] = useState<{
    level: string;
    collectionName: string;
    bookId: string;
  }>({
    level: "",
    collectionName,
    bookId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      level: "",
      bookId,
      collectionName,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.level.trim()) newErrors.name = "Level is required.";
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await Fetch.post("/collection/newLevel", formData);

      console.log(response);

      toast("New level has been added");
      resetForm();
      setIsSheetOpen(false);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        setIsSheetOpen(open);
        if (!open) resetForm();
      }}
    >
      <SheetTrigger asChild>
        <Button variant="default" className="bg-sky-600 hover:bg-sky-500">
          add level
        </Button>
      </SheetTrigger>
      <SheetContent className="h-screen space-y-5 w-full sm:max-w-md bg-white text-sky-600 border-none">
        <SheetHeader>
          <SheetTitle className="text-sky-600 text-2xl">
            New book level
          </SheetTitle>
        </SheetHeader>
        <SheetDescription></SheetDescription>
        <Select
          onValueChange={(value) => setFormData({ ...formData, level: value })}
          value={formData.level}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            {Options.map((item, index) => (
              <SelectItem
                key={index}
                value={item.title}
                className="hover:bg-sky-600 hover:text-white"
              >
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name}</span>
        )}

        <SheetFooter>
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-sky-600"
          >
            {isLoading ? "Загрузка..." : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
