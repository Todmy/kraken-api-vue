export default class PairData {
  constructor(currencies, order, fromValue = 0, toValue = 0) {
    this.currencies = currencies;
    this.unsubscriptionId = undefined;
    this.order = order;
    this.tradesData = [];
    this.fromValue = fromValue;
    this.toValue = toValue;
    this.isFromLastChanged = true;
  }

  set trades(values) {
    this.tradesData = values;

    if (this.isFromLastChanged) {
      this.calculateTo(this.fromValue);
    } else {
      this.calculateFrom(this.toValue);
    }
  }

  getExchangeRate() {
    const rateFn = this.order ? Math.max : Math.min;
    return rateFn.apply(
      Math,
      this.tradesData.map((t) => parseFloat(t))
    );
  }

  calculateTo(value) {
    let exchangeRate = this.getExchangeRate();
    this.fromValue = parseFloat(value);
    const toValue = this.order
      ? this.fromValue / exchangeRate
      : this.fromValue * exchangeRate;
    this.toValue = parseFloat(toValue.toFixed(4).toString());
  }

  calculateFrom(value) {
    let exchangeRate = this.getExchangeRate();
    this.toValue = parseFloat(value);
    const fromValue = this.order
      ? this.toValue * exchangeRate
      : this.toValue / exchangeRate;
    this.fromValue = parseFloat(fromValue.toFixed(4).toString());
  }
}
