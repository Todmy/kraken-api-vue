import { createStore } from "vuex";
import { isSamePair } from "../utils/coreOps";
import PairData from "./entities/PairData";
import wsPlugin from "./plugins/ws";
import types from "./mutationTypes";

const unsubscriptionTimeout = 5; // interval in seconds. Deffered unsubscription - if user rapidly change pairs

const store = createStore({
  plugins: [wsPlugin],

  state: {
    selectedPair: undefined,
    pairs: [new PairData(["BTC", "USD"], 0)],
    available: [],
  },
  getters: {
    selectedCoinsPair(state) {
      const selected = state.selectedPair;
      if (!selected) return [];

      return selected.order ? selected.curencies.reverse() : selected.curencies;
    },
    tradeRate(state) {
      const selected = state.selectedPair;
      if (!selected || !selected.trades.length) return 0;
      const rateFn = selected.order ? Math.max : Math.min;
      return rateFn.apply(
        Math,
        selected.trades.map((t) => parseFloat(t[0]))
      );
    },
  },
  mutations: {
    [types.SELECT_PAIR](store, pairObj = store.pairs[0]) {
      store.selectedPair = pairObj;
    },
    [types.RECEIVE_DATA](store, message) {
      store.selectedPair.trades = message[1];
    },
    [types.SUBSCRIBE_TO_DATA](store, pairObj) {
      this.commit(types.SELECT_PAIR, pairObj);
    },
    [types.UNSUBSCRIBE_FROM_DATA](store, pair) {
      let index = store.pairs.findIndex(
        (pairObj) =>
          console.log(pairObj.curencies, pair) ||
          isSamePair(pairObj.curencies, pair)
      );
      store.pairs.splice(index, 1);
    },
    [types.SET_UNSUBSCRIBE_ID](store, timeoutId) {
      store.selectedPair.unsubscriptionId = timeoutId;
    },
  },
  actions: {
    init({ state, dispatch }) {
      const pair = state.pairs[0];
      dispatch("subscribeToPair", pair.curencies);
    },
    subscribeToPair({ state, commit }, pair) {
      const previousPair = state.selectedPair;

      if (!previousPair) {
        commit(types.SUBSCRIBE_TO_DATA, state.pairs[0]);
        return;
      }

      if (isSamePair(previousPair.curencies, pair)) return;

      const existingPair = state.pairs.find((p) =>
        isSamePair(p.curencies, pair)
      );

      const timeoutId = setTimeout(
        () => commit(types.UNSUBSCRIBE_FROM_DATA, previousPair.curencies),
        unsubscriptionTimeout
      );
      commit(types.SET_UNSUBSCRIBE_ID, timeoutId);

      if (existingPair) {
        clearTimeout(existingPair.unsubscriptionId);
        commit(types.SELECT_PAIR, existingPair);
      } else {
        const pairObj = new PairData(pair, 0);
        commit(types.SUBSCRIBE_TO_DATA, pairObj);
      }
    },
  },
});

store.dispatch("init");

export default store;
