import { Card, CardContent } from "@client/components/ui/card";
import { cn } from "@client/lib/utils";
import React, { useRef } from "react";

// Define the props expected by the Dropzone component
interface DropzoneProps {
  onChange: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

// Create the Dropzone component receiving props
export function Dropzone({
  onChange,
  className,
  disabled,
  ...props
}: DropzoneProps) {
  // Initialize state variables using the useState hook
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element

  // Function to handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Function to handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  // Function to handle file input change event
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  // Function to handle processing of uploaded files
  const handleFiles = (files: FileList) => {
    onChange([...files]);
  };

  // Function to simulate a click on the file input element
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={cn(
        `border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
        {
          "pointer-events-none": disabled,
          "opacity-50": disabled,
        },
        className,
      )}
      {...props}
      onClick={handleButtonClick}
    >
      <CardContent
        className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="font-medium">
            Drag Files to Upload or Click Here
          </span>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </div>
      </CardContent>
    </Card>
  );
}
