import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@client/components/ui/alert-dialog";
import { buttonVariants } from "@client/components/ui/button";
import { DataTable } from "@client/components/ui/data-table";
import { DataTableColumnHeader } from "@client/components/ui/data-table-column-header";
import { InlineCode } from "@client/components/ui/inline-code";
import { formatBytes } from "@client/lib/formatBytes";
import { cn } from "@client/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IFile {
  _id: string;
  name: string;
  type: string;
  size: number;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export function HomePage() {
  const [files, setFiles] = useState<IFile[]>([]);

  useEffect(() => {
    axios.get("/api/files").then((res) => {
      setFiles(res.data);
    });
  }, []);

  const columns: ColumnDef<IFile>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader title="ID" column={column} />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader title="File Name" column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <a
            className="underline underline-offset-4 hover:text-muted-foreground"
            href={`/files/${row.original._id}.${row.original.type}`}
          >
            {row.original.name}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader title="Size" column={column} />
      ),
      cell: ({ row }) => <div>{formatBytes(row.original.size)}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) => (
        <div>{new Date(row.original.createdAt).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "actions",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader title="Actions" column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(buttonVariants({ variant: "destructive" }), "h-8")}
            >
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  <InlineCode>{row.original.name}</InlineCode> will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => {
                    axios.delete(`/api/files/${row.original._id}`).then(() => {
                      setFiles((prev) =>
                        prev.filter((file) => file._id !== row.original._id),
                      );
                      toast.success("File deleted successfully.");
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="container flex justify-center items-center mt-12 mb-6">
      <DataTable columns={columns} data={files} />
    </div>
  );
}
