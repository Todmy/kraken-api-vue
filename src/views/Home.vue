<template>
  <div class="home">
    <header>
      <LanguagePicker />
    </header>
    <img alt="Vue logo" src="../assets/logo.png" />
    <p>message: {{ $t("hello") }}</p>
    from:
    <div>{{ selectedCoinsPair[0] }}</div>
    to:
    <div>{{ selectedCoinsPair[1] }}</div>
    rate:
    <div>{{ tradeRate }}</div>
  </div>
</template>

<script>
import LanguagePicker from "../components/LanguagePicker";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",

  title() {
    return `${this.fromCurrency} to ${this.toCurrency}`;
  },

  components: {
    LanguagePicker,
  },

  computed: { ...mapGetters(["selectedCoinsPair", "tradeRate"]) },

  // data: () => ({
  //   fromCurrency: "BTC",
  //   toCurrency: "USD",
  // }),

  mounted() {
    // setTimeout(() => {
    //   this.subscribeToPair([this.fromCurrency, this.toCurrency]);
    // }, 2000);
    // setTimeout(() => {
    //   this.subscribeToPair(["ETH", this.toCurrency]);
    // }, 4000);
  },

  methods: {
    ...mapActions(["subscribeToPair"]),
  },
};
</script>

<i18n lang="yaml">
en:
  hello: "hello world!"
ru:
  hello: "привет, мир!"
</i18n>

<style lang="scss" scoped>
header {
  float: right;
}
</style>
