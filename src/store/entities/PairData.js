export default class PairData {
  constructor(curencies, order) {
    this.curencies = curencies;
    this.unsubscriptionId = undefined;
    this.order = order;
    this.trades = [];
  }
}
