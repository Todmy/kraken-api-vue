<template>
  <div class="home">
    <header>
      <LanguagePicker />
    </header>
    <img alt="Vue logo" src="../assets/logo.png" />
    <p>message: {{ $t("hello") }}</p>
  </div>
</template>

<script>
import LanguagePicker from "../components/LanguagePicker";

export default {
  name: "Home",

  title() {
    return `${this.fromCurrency} to ${this.toCurrency}`;
  },

  components: {
    LanguagePicker,
  },

  data: () => ({
    fromCurrency: "BTC",
    toCurrency: "USD",
  }),
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
