import { NotAllowedPage } from "@client/pages/NotAllowedPage";
import { useStoreState } from "@client/store";

export function WhitelistedOnly(Component: React.ComponentType) {
  return function WhitelistedOnlyWrapper() {
    const auth = useStoreState((state) => state.auth);

    const allowed = auth?.whitelisted;

    if (!allowed) {
      return <NotAllowedPage />;
    }

    return <Component />;
  };
}
