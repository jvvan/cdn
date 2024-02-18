import { Button } from "@client/components/ui/button";
import { Card, CardContent, CardHeader } from "@client/components/ui/card";
import { Dropzone } from "@client/components/ui/dropzone";
import { Progress } from "@client/components/ui/progress";
import { formatBytes } from "@client/lib/formatBytes";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FileUpload {
  file: File;
  body: null | {
    _id: string;
    type: string;
  };
  progress: number;
}

export function UploadPage() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function handleUpload() {
    if (!files.length) {
      return toast.error("Please select a file to upload");
    }

    if (done) {
      return toast.error("Please select other files to upload");
    }

    if (loading) {
      return toast.error("Please wait for the current upload to finish");
    }

    setLoading(true);
    setDone(false);

    const promises = files.map((file, i) => {
      const formData = new FormData();
      formData.append("file", file.file);

      return axios
        .post("/api/files/upload", formData, {
          onUploadProgress: (e) => {
            const progress = (e.loaded / e.total!) * 100;
            setFiles((prev) => {
              const next = [...prev];
              next[i].progress = progress;
              return next;
            });
          },
        })
        .then((res) => {
          setFiles((prev) => {
            const next = [...prev];
            next[i].progress = 100;
            next[i].body = res.data;
            return next;
          });
        });
    });

    Promise.allSettled(promises).then((results) => {
      setLoading(false);
      setDone(true);

      const errors = results.filter((r) => r.status === "rejected");
      const successes = results.filter((r) => r.status === "fulfilled");

      if (errors.length) {
        toast.error(
          `Failed to upload ${errors.length} file${
            errors.length > 1 ? "s" : ""
          }`,
        );
      }

      if (successes.length) {
        toast.success(
          `Successfully uploaded ${successes.length} file${
            successes.length > 1 ? "s" : ""
          }`,
        );
      }
    });
  }

  return (
    <div className="container flex items-center flex-col">
      <h1 className="text-3xl pt-12 font-bold">Upload</h1>

      <Dropzone
        onChange={(files) => {
          setFiles(
            files.map((file) => ({
              file,
              progress: 0,
              body: null,
            })),
          );
          setLoading(false);
          setDone(false);
        }}
        className="mt-12 w-96 h-24 flex items-center justify-center"
        disabled={loading}
      />

      {files.length > 0 && (
        <div className="mt-12">
          {files.map((file, i) => (
            <Card key={i}>
              <CardHeader>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {file.body ? (
                    <a
                      href={`/files/${file.body?._id}.${file.body.type}`}
                      target="_blank"
                      className={"underline"}
                    >
                      {file.file.name}
                    </a>
                  ) : (
                    <>{file.file.name}</>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatBytes(file.file.size)}
                </p>
              </CardHeader>
              <CardContent>
                <Progress value={file.progress} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button
        className="bg-primary mt-12 mb-6"
        onClick={() => handleUpload()}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
}
