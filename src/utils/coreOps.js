import aliases from "./assetAliases";

export function isSamePair(leftPair, rightPair) {
  return (
    leftPair.length === rightPair.length &&
    leftPair.every((val) => rightPair.includes(val))
  );
}

export function toAlias(pair) {
  let resultPair = [...pair];
  Object.entries(aliases).forEach(([key, val]) => {
    if (pair[0] === val) {
      resultPair[0] = key;
    }
    if (pair[1] === val) {
      resultPair[1] = key;
    }
  });

  return resultPair;
}

export function fromAlias(pair) {
  const aliasKeys = Object.keys(aliases);
  let resultPair = [...pair];

  if (aliasKeys.includes(pair[0])) {
    resultPair[0] = aliases[pair[0]];
  }
  if (aliasKeys.includes(pair[1])) {
    resultPair[1] = aliases[pair[1]];
  }

  return resultPair;
}
