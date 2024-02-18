import { Action, action, createStore, createTypedHooks } from "easy-peasy";

export interface IMeta {
  name: string;
  title: string;
  baseurl: string;
  color: string;
}

export interface IAuth {
  _id: string;
  id: string;
  username: string;
  whitelisted: boolean;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
  discord: {
    avatar: string;
  };
}

export interface IStore {
  auth: IAuth | null;
  loading: boolean;
  meta: IMeta | null;

  setAuth: Action<IStore, IAuth | null>;
  updateAuth: Action<IStore, Partial<IAuth>>;
  setLoading: Action<IStore, boolean>;
  setMeta: Action<IStore, IMeta | null>;
}

export const store = createStore<IStore>({
  auth: null,
  loading: true,
  meta: null,

  setAuth: action((state, payload) => {
    state.auth = payload;
  }),

  updateAuth: action((state, payload) => {
    if (state.auth) {
      state.auth = { ...state.auth, ...payload };
    } else {
      state.auth = payload as IAuth;
    }
  }),

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),

  setMeta: action((state, payload) => {
    state.meta = payload;
  }),
});

const typedHooks = createTypedHooks<IStore>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
