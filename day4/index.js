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
  elf1 = elf1.map(i => Number(i))
  elf2 = elf2.map(i => Number(i))
  if(elf1.every(i => elf2.includes(i))) return true;
  if(elf2.every(i => elf1.includes(i))) return true;
  return false;
}

module.exports = (input) => {
  const elfPairings = input.split('\n');
  const result = elfPairings.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const [elf1, elf2] = calculateRanges(entry);
    // debug(entry)
    if(checkIfAllOverlap(elf1, elf2)) {
      return memo + 1;
    }  else {
      debug("DEBUG")
      debug(entry)
      // debug(elf1)
      // for(var i = 0; i < elf2.length; i++) {
      //   debug(`Looking for ${elf2[i]}, ${typeof(elf2[i])}`)
      //   debug(`indexOf ${elf1.indexOf(elf2[i])}`)
      // }
    }
    return memo;
  }, 0)
  answer(result, 1);

}