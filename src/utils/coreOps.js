import aliases from "./assetAliases.json";

export function isSamePair(leftPair, rightPair) {
  const aliasKeys = Object.keys(aliases);
  if (aliasKeys.includes(leftPair[0])) {
    leftPair[0] = aliases[leftPair[0]];
  }
  if (aliasKeys.includes(leftPair[1])) {
    leftPair[1] = aliases[leftPair[1]];
  }
  if (aliasKeys.includes(rightPair[0])) {
    rightPair[0] = rightPair[leftPair[0]];
  }
  if (aliasKeys.includes(rightPair[1])) {
    rightPair[1] = rightPair[leftPair[1]];
  }
  return (
    leftPair.length === rightPair.length &&
    leftPair.every((val) => rightPair.includes(val))
  );
}
