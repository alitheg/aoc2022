const {answer, debug} = require('../logger');

const dividerPackets = [[[2]], [[6]]]

const result = {
  CORRECT: 1,
  NULL: 0,
  INCORRECT: -1,
  fmt: (r) => {
    if(r == 1) return 'Correct'
    if(r == -1) return 'Incorrect'
    if(r == 0) return 'No result'
  }
}

const compareArrays = (left, right) => {
  debug('Both values are lists')
  // If both values are lists, compare the first value of each list, then the second value, and so on. 
  // If the lists are the same length and 
  // no comparison makes a decision about the order, 
  // continue checking the next part of the input.
  for(let i = 0; i < Math.max(left.length, right.length); i++) {
    let l = left[i];
    let r = right[i];
    if(l == undefined) {
      // If the left list runs out of items first, 
      // the inputs are in the right order. 
      debug('Left side ran out of items, so inputs are in the right order')
      return result.CORRECT;
    } else {
      if(r == undefined) {
        // If the right list runs out of items first, 
        // the inputs are not in the right order. 
        debug('Right side ran out of items, so inputs are not in the right order')
        return result.INCORRECT;
      } else {
        let res = compareVal(l, r);
        if(res == result.NULL) {
          continue;
        } else {
          return res;
        }
      }
    }
  }
  return result.NULL;
}

const compareVal = (left, right) => {
  debug(`Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`)
  if(typeof(left) == "number" && typeof(right) == "number") {
    // If both values are integers, 
    // the lower integer should come first. 
    if(left < right) {
      // If the left integer is lower than the right integer, 
      // the inputs are in the right order. 
      return result.CORRECT
    }
    if(left > right) {
      // If the left integer is higher than the right integer, 
      // the inputs are not in the right order. 
      return result.INCORRECT
    }
    // Otherwise, the inputs are the same integer; continue checking the next part of the input.
    return result.NULL
  } else {
    if(Array.isArray(left) && Array.isArray(right)) {
      return compareArrays(left, right)
    } else {
      if(typeof(left) == "number") {
        left = [left];
      }
      if(typeof(right) == "number") {
        right = [right];
      }
      return compareVal(left, right);
    }
  }
}

const compare = ({list1, list2}) => {
  return compareArrays(list1, list2)
}

module.exports = (input) => {
  let inputLines = input.split('\n');
  let {packetData, allPackets} = inputLines.reduce(({packetData, buffer, allPackets}, entry) => {
    if(entry.trim() == '') {
      packetData.push({list1: buffer[0], list2: buffer[1]})
      buffer = [];
    } else {
      buffer.push(JSON.parse(entry));
      allPackets.push(JSON.parse(entry))
    }
    return {packetData, buffer, allPackets}
  }, {packetData: [], buffer: [], allPackets: []});
  let results = packetData.reduce((results, pair, ix) => {
    debug(`== Pair ${ix+1} ==`)
    let r = compare(pair);
    if(r == result.CORRECT) {
      // The first pair has index 1, 
      // the second pair has index 2, and so on
      results.push(ix+1);
    }
    return results;
  }, []);
  answer(results.reduce((a,b) => a+b), 1);
  let correctOrder = allPackets.concat(dividerPackets).sort((a,b) => compareArrays(b,a))
  let ans = correctOrder.reduce((answers, packet, ix) => {
    if(dividerPackets.includes(packet)) {
      answers.push(ix+1)
    }
    return answers
  }, []);
  answer(ans[0]*ans[1], 2)
}