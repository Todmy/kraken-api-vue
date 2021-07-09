import { createStore } from "vuex";
import network from "../network/network";
import { isSamePair } from "../utils/coreOps";
import PairData from "../entities/PairData";
import wsPlugin from "./plugins/ws";
import types from "./mutationTypes";

// const unsubscriptionTimeout = 5; // interval in seconds. Deffered unsubscription - if user rapidly change pairs

const store = createStore({
  plugins: [wsPlugin],

  state: {
    // selectedPair: PairData
    selectedPair: new PairData(["XBT", "USD"], 0),
    // available: AvailablePair
    available: [],
  },
  getters: {
    selectedCoinsPair(state) {
      const selected = state.selectedPair;

      if (!selected) return [];

      const pair = [...selected.currencies];
      return selected.order ? pair.reverse() : pair;
    },
    leftAvailablePairs: ({ available, selectedPair }) => {
      if (!selectedPair) return [];
      let coin = selectedPair.order
        ? selectedPair.currencies[0]
        : selectedPair.currencies[1];
      return available.filter((availablePair) =>
        availablePair.currencies.includes(coin)
      );
    },
    rightAvailablePairs: ({ available, selectedPair }) => {
      if (!selectedPair) return [];
      let coin = selectedPair.order
        ? selectedPair.currencies[1]
        : selectedPair.currencies[0];
      return available.filter((availablePair) =>
        availablePair.currencies.includes(coin)
      );
    },
    valueCalculations: ({ selectedPair }) =>
      selectedPair ? [selectedPair.fromValue, selectedPair.toValue] : [0, 0],
  },
  mutations: {
    [types.SELECT_PAIR](store, pairObj) {
      store.selectedPair = pairObj;
    },
    [types.RECEIVE_DATA](store, trades) {
      store.selectedPair.trades = trades;
    },
    [types.SUBSCRIBE_TO_DATA]() {},
    [types.UNSUBSCRIBE_FROM_DATA]() {},
    [types.SET_AVAILABLE_PAIRS](store, pairs) {
      store.available = pairs;
    },
  },
  actions: {
    async init({ state, dispatch }) {
      await dispatch("loadPairs");
      await dispatch("loadSelectedPair", state.selectedPair);
    },
    async loadPairs({ commit }) {
      const pairs = await network.getPairs();
      commit(types.SET_AVAILABLE_PAIRS, pairs);
    },
    setActiveCalculationData({ state, dispatch }, { type, value, position }) {
      if (type === "input") {
        const selectedValue = state.selectedPair;
        if (position === "from") {
          selectedValue.calculateTo(value);
          selectedValue.isFromLastChanged = true;
        } else {
          selectedValue.calculateFrom(value);
          selectedValue.isFromLastChanged = false;
        }
      } else if (type === "select") {
        const {
          currencies: prevPair,
          toValue,
          fromValue,
          order: prevOrder,
        } = state.selectedPair;
        const changedCoinIndex = position === "from" ? 0 : 1;
        const newPairCurrencies = [...prevPair];

        if (prevOrder) {
          newPairCurrencies.reverse();
        }
        newPairCurrencies[changedCoinIndex] = value;

        const availablePair = state.available.find((pair) =>
          isSamePair(pair.currencies, newPairCurrencies)
        );
        const plainOrder =
          availablePair.currencies.findIndex((coin) => coin === value) !==
          changedCoinIndex;
        const order = Number(plainOrder);

        const newPair = new PairData(
          availablePair.currencies,
          order,
          fromValue,
          toValue
        );

        newPair.isFromLastChanged = newPairCurrencies[0] !== value;

        dispatch("loadSelectedPair", newPair);
      }
    },
    async loadSelectedPair({ state, commit }, pair) {
      const previousPair = state.selectedPair;

      if (previousPair && isSamePair(previousPair.currencies, pair)) return;

      const coinsPair = pair.currencies.join("");
      const pairTradeInfo = await network.loadPairTicks(coinsPair);

      this.dispatch("subscribeToPair", pair);
      commit(types.RECEIVE_DATA, pairTradeInfo);
      if (previousPair && previousPair !== pair) {
        commit(types.UNSUBSCRIBE_FROM_DATA, previousPair.currencies.join("/"));
      }
    },
    subscribeToPair({ commit, state }, pairObj) {
      const { wsname } = state.available.find((a) =>
        isSamePair(a.currencies, pairObj.currencies)
      );
      if (wsname) {
        commit(types.SUBSCRIBE_TO_DATA, wsname);
      }

      commit(types.SELECT_PAIR, pairObj);
    },
  },
});

store.dispatch("init");

export default store;
