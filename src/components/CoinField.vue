<template>
  <div class="wrapper">
    <input
      type="number"
      :value="value"
      @input="emitToParent(`input`, $event)"
      @keypress="preventExpoInput"
    />
    <select :value="coin" @change="emitToParent(`select`, $event)">
      <option
        v-for="(coinPair, index) in coinsToExchange"
        :key="index"
        :value="coinPair"
      >
        {{ coinPair }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: ["coin", "availablePairs", "pairCoin", "value"],
  data: (v) => ({
    inputValue: v.value,
  }),
  computed: {
    coinsToExchange: ({ pairCoin, availablePairs }) =>
      availablePairs
        .map((el) => el.currencies)
        .map((arr) => {
          const resultArr = [...arr];
          const index = arr.findIndex((el) => el === pairCoin);
          resultArr.splice(index, 1);
          return resultArr[0];
        }),
  },
  methods: {
    emitToParent(type, event) {
      this.$emit("valueChanged", {
        type,
        value: event.target.value || "0",
      });
    },
    preventExpoInput($event) {
      var keyCode = $event.keyCode ? $event.keyCode : $event.which;
      if (keyCode === 101) {
        $event.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 250px;
  border: 1px solid skyblue;
  border-radius: 3px;
  display: flex;
  align-items: stretch;
  padding: 2px;

  input {
    border: none;
    padding: 10px;
    margin: 5px 0;
    flex-grow: 1;

    &:focus {
      outline: none;
    }

    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  select {
    text-align-last: center;
    width: 70px;
  }
}
</style>
