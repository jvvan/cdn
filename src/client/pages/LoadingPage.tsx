import { Loader2 } from "lucide-react";

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 size={150} className="animate-spin" />
    </div>
  );
}
