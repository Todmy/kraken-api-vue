import axios from "axios";
import AvailablePair from "../entities/AvailablePair";

export default {
  async getAssets() {
    let response = await axios.get(`/api/Assets`);
    return Object.keys(response.data.result || {});
  },
  async getPairs() {
    let response = await axios.get(`/api/AssetPairs?info=info`);
    const assets = await this.getAssets();
    const pairs = Object.entries(response.data.result).map(([key, value]) => ({
      pair: key,
      wsname: value.wsname,
    }));

    const splittedPairs = pairs.map((pairObj) => {
      if (pairObj.wsname) {
        return new AvailablePair(pairObj.wsname.split("/"), pairObj.wsname);
      }

      const firstAsset = assets.find((asset) => pairObj.pair.includes(asset));
      const isFirst = pairObj.pair.startsWith(firstAsset);
      const secondAsset = pairObj.pair.replace(firstAsset, "");
      const pair = isFirst
        ? [firstAsset, secondAsset]
        : [secondAsset, firstAsset];

      return new AvailablePair(pair);
    });

    return splittedPairs;
  },
  async loadPairTicks(pair) {
    let response = await axios.get(`/api/Ticker?pair=${pair}`);
    let data = Object.values(response.data.result)[0];
    return [data.a[0], data.b[0], data.c[0]];
  },
};
