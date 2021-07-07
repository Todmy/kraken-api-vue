import { createStore } from "vuex";
import network from "../network/network";
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
        selected.trades.map((t) => parseFloat(t))
      );
    },
    availablePairs: (state) => (asset) => {
      return state.available.filter((availablePair) =>
        availablePair.pair.includes(asset)
      );
    },
  },
  mutations: {
    [types.SELECT_PAIR](store, pairObj = store.pairs[0]) {
      store.selectedPair = pairObj;
    },
    [types.RECEIVE_DATA](store, trades) {
      store.selectedPair.trades = trades;
    },
    [types.SUBSCRIBE_TO_DATA]() {},
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
    [types.SET_AVAILABLE_PAIRS](store, pairs) {
      store.available = pairs;
    },
  },
  actions: {
    async init({ state, dispatch }) {
      const pair = state.pairs[0];
      await dispatch("loadPairs");
      await dispatch("loadSelectedPair", pair.curencies);
    },
    async loadPairs({ commit }) {
      const pairs = await network.getPairs();
      const assets = await network.getAssets();

      const splittedPairs = pairs.map((pairObj) => {
        if (pairObj.wsname) {
          return {
            ...pairObj,
            pair: pairObj.wsname.split("/"),
          };
        }

        const firstAsset = assets.find((asset) => pairObj.pair.includes(asset));
        const isFirst = pairObj.pair.startsWith(firstAsset);
        const secondAsset = pairObj.pair.replace(firstAsset, "");

        return {
          pair: isFirst ? [firstAsset, secondAsset] : [secondAsset, firstAsset],
          wsname: undefined,
        };
      });
      commit(types.SET_AVAILABLE_PAIRS, splittedPairs);
    },
    async loadSelectedPair({ state, commit }, pair) {
      const previousPair = state.selectedPair;
      const existingPair = state.pairs.find((p) =>
        isSamePair(p.curencies, pair)
      );

      if (previousPair && isSamePair(previousPair.curencies, pair)) return;

      if (!previousPair || !existingPair) {
        const pairObj = !previousPair ? state.pairs[0] : new PairData(pair, 0);

        const pairTradeInfo = await network.loadPairTicks(
          pairObj.curencies.join("")
        );

        this.dispatch("subscribeToPair", pairObj);
        commit(types.RECEIVE_DATA, pairTradeInfo);

        return;
      }

      const timeoutId = setTimeout(
        () => commit(types.UNSUBSCRIBE_FROM_DATA, previousPair.curencies),
        unsubscriptionTimeout
      );
      commit(types.SET_UNSUBSCRIBE_ID, timeoutId);

      clearTimeout(existingPair.unsubscriptionId);
      commit(types.SELECT_PAIR, existingPair);
    },
    subscribeToPair({ commit, state }, pairObj) {
      const { wsname } = state.available.find((a) =>
        isSamePair(a.pair, pairObj.curencies)
      );
      commit(types.SUBSCRIBE_TO_DATA, wsname);
      commit(types.SELECT_PAIR, pairObj);
    },
  },
});

store.dispatch("init");

export default store;
