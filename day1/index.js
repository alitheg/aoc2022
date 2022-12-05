const {answer, debug} = require('../logger');

module.exports = (input) => {
  const rawCals = input.split('\n');
  let index = 0;
  const calTotals = rawCals.reduce((memo, entry) => {
    if(!memo[index]) memo[index] = 0;
    if(entry == "") {
      index++;
    } else {
      memo[index] = memo[index] + Number(entry)
    }
    return memo;
  }, [])
  answer(Math.max(...calTotals), 1);
  const sortedCals = calTotals.sort(function(a, b){return b - a})
  const top3Cals = sortedCals.splice(0, 3)
  answer(top3Cals.reduce((t, e) => t+e, 0), 2)
}