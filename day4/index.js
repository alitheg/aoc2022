const {answer, debug} = require('../logger');

const calculateRange = (elf) => {
  const [start, end] = elf.split('-');
  const range = [];
  for (var i = Number(start); i <= Number(end); i++) {
    range.push(Number(i));
  }
  return range;
}
const calculateRanges = (pairingDef) => {
  const [elf1, elf2] = pairingDef.split(',');
  return [calculateRange(elf1), calculateRange(elf2)]
}
const checkIfAllOverlap = (elf1, elf2) => {
  return elf1.every(i => elf2.includes(i)) || elf2.every(i => elf1.includes(i));
}

module.exports = (input) => {
  const elfPairings = input.split('\n');
  const result = elfPairings.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const [elf1, elf2] = calculateRanges(entry);
    // debug(entry)
    if(checkIfAllOverlap(elf1, elf2)) {
      return memo + 1;
    }
    return memo;
  }, 0)
  answer(result, 1);

}