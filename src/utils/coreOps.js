export function isSamePair(leftPair, rightPair) {
  return (
    leftPair.length === rightPair.length &&
    leftPair.every((val) => rightPair.includes(val))
  );
}
