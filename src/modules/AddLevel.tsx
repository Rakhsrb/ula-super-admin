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
  collectionId,
  bookId,
}: {
  collectionId: string;
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
    collectionId: string;
    bookId: string;
  }>({
    level: "",
    collectionId,
    bookId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      level: "",
      bookId,
      collectionId,
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
        <Button variant="default" className="bg-blue-600 hover:bg-blue-500">
          Add level
        </Button>
      </SheetTrigger>
      <SheetContent className="h-screen space-y-5 w-full sm:max-w-md bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">
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
                className="hover:bg-green-600"
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
            variant="secondary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
