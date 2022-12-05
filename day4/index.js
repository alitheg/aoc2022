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
const checkIfAnyOverlap = (elf1, elf2) => {
  return elf1.some(i => elf2.includes(i)) || elf2.some(i => elf1.includes(i));
}

module.exports = (input) => {
  const elfPairings = input.split('\n');
  const result = elfPairings.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const [elf1, elf2] = calculateRanges(entry);
    // debug(entry)
    if(checkIfAnyOverlap(elf1, elf2)) {
      memo = {all: memo.all, some: memo.some + 1};
      if(checkIfAllOverlap(elf1, elf2)) {
        memo = {all: memo.all + 1, some: memo.some};
      }
    }
    return memo;
  }, {all: 0, some: 0})
  answer(result.all, 1);
  answer(result.some, 2);

}