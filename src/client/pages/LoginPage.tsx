import { Button } from "@client/components/ui/button";
import { useStoreState } from "../store";

export function LoginPage() {
  const meta = useStoreState((state) => state.meta);

  return (
    // create a container div with a title and a login button both centered
    <div className="flex flex-col items-center justify-center h-[100%]">
      <h1 className="text-4xl font-bold text-white mb-12">{meta?.name}</h1>
      <Button
        asChild
        className="mt-4 px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600"
      >
        <a href="/api/auth/login">Login with Discord</a>
      </Button>
    </div>
  );
}
