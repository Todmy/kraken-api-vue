import axios from "axios";

export default {
  async getAssets() {
    let response = await axios.get(`/api/Assets`);
    return Object.keys(response.data.result || {});
  },
  async getPairs() {
    let response = await axios.get(`/api/AssetPairs?info=info`);
    return Object.entries(response.data.result).map(([key, value]) => ({
      pair: key,
      wsname: value.wsname,
    }));
  },
  async loadPairTicks(pair) {
    let response = await axios.get(`/api/Ticker?pair=${pair}`);
    let data = Object.values(response.data.result)[0];
    return [data.a[0], data.b[0], data.c[0]];
  },
};
