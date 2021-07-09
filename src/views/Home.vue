<template>
  <div class="home">
    <header>
      <LanguagePicker />
    </header>
    <h1>{{ $t("header") }}</h1>
    <div class="form">
      <CoinField
        :coin="selectedCoinsPair[0]"
        :value="valueCalculations[0]"
        :availablePairs="leftAvailablePairs"
        :pairCoin="selectedCoinsPair[1]"
        @valueChanged="calculate(0, $event)"
      />
      <div class="equal-sign">=</div>
      <CoinField
        :coin="selectedCoinsPair[1]"
        :value="valueCalculations[1]"
        :availablePairs="rightAvailablePairs"
        :pairCoin="selectedCoinsPair[0]"
        @valueChanged="calculate(1, $event)"
      />
    </div>
    <br />
    <br />
    <a href="https://paybis.com/btc-to-usd/" target="blank">{{
      $t("buyHere")
    }}</a>
  </div>
</template>

<script>
import LanguagePicker from "../components/LanguagePicker";
import CoinField from "../components/CoinField";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",

  title() {
    return `${this.selectedCoinsPair[0]} to ${this.selectedCoinsPair[1]}`;
  },

  components: {
    LanguagePicker,
    CoinField,
  },

  computed: {
    ...mapGetters([
      "selectedCoinsPair",
      "leftAvailablePairs",
      "rightAvailablePairs",
      "valueCalculations",
    ]),
  },

  methods: {
    ...mapActions(["setActiveCalculationData"]),
    calculate(position, event) {
      this.setActiveCalculationData({
        ...event,
        position: position === 0 ? "from" : "to",
      });
    },
  },
};
</script>

<i18n lang="yaml">
en:
  header: "Please select coins you want to convert!"
  buyHere: "Buy here"
ru:
  header: "Пожалуйста выберите монеты для конвертации!"
  buyHere: "Купить здесь"
</i18n>

<style lang="scss" scoped>
header {
  float: right;
}

.form {
  display: inline-flex;
  align-items: center;
  justify-items: center;

  .equal-sign {
    font-size: 2.2em;
    text-align: center;
  }
}
</style>
