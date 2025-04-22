// src/components/ImageUploader.tsx
import * as React from "react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

// Define interfaces for component props
interface LabelProps {
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

interface InputProps {
  id?: string;
  type?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

interface SkeletonProps {
  className?: string;
}

// Interface for Upload API response (updated to match Swagger documentation)
interface UploadResponse {
  fileUrl: string; // Changed from 'url' to 'fileUrl'
}

const axiosInstance = axios.create({
  baseURL: "https://keldibekov.online",
});

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess, onError }) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post<UploadResponse>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Upload API response:", response.data); // Debug the response

      // Validate the response
      if (!response.data.fileUrl) {
        throw new Error("Upload API did not return a file URL");
      }

      return response.data.fileUrl; // Changed from 'url' to 'fileUrl'
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error("Upload API error response:", error.response.data);
        throw new Error(error.response.data.message || "Failed to upload image");
      }
      console.error("Upload error:", error);
      throw new Error("An error occurred while uploading the image");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onError("No file selected");
      return;
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      onError("Please upload a .jpg or .png file");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      onUploadSuccess(url);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <Label className="flex flex-col items-center border border-gray-300 rounded p-2 cursor-pointer">
        <span className="text-xl">↑</span>
        <span className="text-xs">.jpg or .png</span>
        <Input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImageChange}
          className="hidden"
          disabled={uploading}
        />
        {uploading && <Skeleton className="h-4 w-20 mt-2" />}
      </Label>
    </div>
  );
};

export default ImageUploader;