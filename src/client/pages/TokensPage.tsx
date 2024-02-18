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
import { Button, buttonVariants } from "@client/components/ui/button";
import { DataTable } from "@client/components/ui/data-table";
import { DataTableColumnHeader } from "@client/components/ui/data-table-column-header";
import { InlineCode } from "@client/components/ui/inline-code";
import { cn } from "@client/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IToken {
  _id: string;
  token: string;
  lastUsed: string;
  createdAt: string;
}

export function TokensPage() {
  const [files, setFiles] = useState<IToken[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/api/users/@me/tokens").then((res) => {
      setFiles(res.data);
    });
  }, []);

  const columns: ColumnDef<IToken>[] = [
    {
      accessorKey: "_id",
      header: ({ column }) => (
        <DataTableColumnHeader title="ID" column={column} />
      ),
    },
    {
      accessorKey: "token",
      header: ({ column }) => (
        <DataTableColumnHeader title="Token" column={column} />
      ),
      cell: ({ row }) => (
        <div className="w-max">
          <p className="blur-sm hover:blur-none min-w-0">
            {row.original.token}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "lastUsed",
      header: ({ column }) => (
        <DataTableColumnHeader title="Last Used" column={column} />
      ),
      cell: ({ row }) => (
        <div>{new Date(row.original.lastUsed).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) => (
        <div>{new Date(row.original.createdAt).toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "actions",
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
                  Token <InlineCode>{row.original._id}</InlineCode> will be
                  permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => {
                    axios
                      .delete(`/api/users/@me/tokens/${row.original._id}`)
                      .then(() => {
                        setFiles((prev) =>
                          prev.filter((f) => f._id !== row.original._id),
                        );
                        toast.success("Token deleted");
                      })
                      .catch((e) => {
                        toast.error(e.response.data.error);
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
    <div className="container flex items-center flex-col">
      <div className="mt-12 w-full flex justify-end">
        <Button
          className="w-32"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            axios
              .post("/api/users/@me/tokens")
              .then((res) => {
                setFiles((prev) => [...prev, res.data]);
                setLoading(false);
                toast.success("Token created");
              })
              .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.error);
              });
          }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <p>Create Token</p>
          )}
        </Button>
      </div>
      <div className="mt-4 mb-6 w-full">
        <DataTable columns={columns} data={files} />
      </div>
    </div>
  );
}
