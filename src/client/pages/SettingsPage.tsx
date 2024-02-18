import { Button } from "@client/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/components/ui/form";
import { Input } from "@client/components/ui/input";
import { useStoreActions, useStoreState } from "@client/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username must be at least 1 character" })
    .max(128, { message: "Username must be at most 128 characters" }),
});

export function SettingsPage() {
  const auth = useStoreState((state) => state.auth);
  const setAuth = useStoreActions((actions) => actions.setAuth);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: auth!.username,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .patch("/api/users/@me", values)
      .then((res) => {
        setAuth({ ...auth, ...res.data });
      })
      .then(() => {
        toast.success("Settings updated");
      })
      .catch((e) => {
        toast.error(e.response.data.error);
      });
  }

  return (
    <div className="container flex items-center flex-col">
      <h1 className="text-3xl pt-12 font-bold">Settings</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
