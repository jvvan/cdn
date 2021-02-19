import { action, createStore } from "easy-peasy";

const store = createStore({
  auth: null,
  loading: true,
  meta: null,
  setLoading: action((state, payload) => {
    state.loading = payload ?? true;
  }),
  setAuth: action((state, payload) => {
    state.auth = payload;
  }),
  setMeta: action((state, payload) => {
    state.meta = payload;
  }),
});

export default store;
