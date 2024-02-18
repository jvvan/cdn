import { AlertTriangle } from "lucide-react";

export function NotAllowedPage() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center">
        <AlertTriangle size={100} className="mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p>You are not allowed to view this page.</p>
      </div>
    </div>
  );
}
