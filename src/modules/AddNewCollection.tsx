import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";

export function AddNewCollection({ mutate }: { mutate: any }) {
  const [formData, setFormData] = useState<{
    collectionName: string;
    photo: File | null;
  }>({
    photo: null,
    collectionName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      collectionName: "",
      photo: null,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.collectionName.trim())
      newErrors.collectionName = "Заголовок обязателен.";
    if (!formData.photo) newErrors.photo = "Фото обязательно.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, photo: file });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await Fetch.post(
        "/collection/createNewCollection",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log(response);

      toast("Collection has been created successfully!", {
        action: {
          label: "Cancel",
          onClick: () => console.log("Cancel"),
        },
      });
      resetForm();
      setIsSheetOpen(false);
      mutate();
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
        <Button variant="default">New collection</Button>
      </SheetTrigger>
      <SheetContent className="h-screen overflow-y-auto w-full sm:max-w-md sm:h-auto bg-white text-sky-600 border-none">
        <SheetHeader>
          <SheetTitle className="text-sky-600 text-2xl">
            Adding new collection
          </SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <span>Fill the fields to create a new collection</span>
        </SheetDescription>
        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="title">
              Collection name
              <span
                className={`${
                  errors.collectionName ? "text-red-600" : "text-blue-600"
                }`}
              >
                *
              </span>
            </Label>
            <Input
              id="collectionName"
              name="collectionName"
              value={formData.collectionName}
              onChange={handleInputChange}
              className={errors.collectionName ? "border-red-500" : ""}
            />
            {errors.collectionName && (
              <span className="text-red-500 text-sm">
                {errors.collectionName}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="photo"
              className="block text-sm font-medium text-white"
            >
              Photo
              <span
                className={`${errors.photo ? "text-red-600" : "text-blue-600"}`}
              >
                *
              </span>
            </Label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="photo"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-sky-600 rounded-lg cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formData.photo ? (
                  <img
                    src={URL.createObjectURL(formData.photo)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-sm text-sky-600">Upload image</span>
                )}
                <Input
                  id="photo"
                  type="file"
                  name="photo"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {formData.photo && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, photo: null })}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            {errors.photo && (
              <span className="text-red-500 text-sm">{errors.photo}</span>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="default"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-sky-600"
          >
            {isLoading ? "Loading..." : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
