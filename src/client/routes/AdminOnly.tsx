import { NotAllowedPage } from "@client/pages/NotAllowedPage";
import { useStoreState } from "@client/store";

export function AdminOnly(Component: React.ComponentType) {
  return function AdminOnlyWrapper() {
    const auth = useStoreState((state) => state.auth);

    const allowed = auth?.whitelisted && auth?.admin;

    if (!allowed) {
      return <NotAllowedPage />;
    }

    return <Component />;
  };
}
