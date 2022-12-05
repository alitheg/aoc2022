const {answer, debug} = require('../logger');

const generateIndices = (line1) => {
  const indices = [];
  line1.split('').forEach((el, ix) => {
    if(el.trim() != '') indices[Number(el)-1] = ix;
  });
  return indices;
}
const buildStacks = (rows, indices) => {
  const stacks = indices.map(()=>[]);
  rows.forEach(r => {
    indices.forEach((i, ix) => {
      if(r[i].trim()) {
        stacks[ix].push(r[i])
      }
    })
  })
  return stacks
}
const parseInstructionPart1 = (line) => {
  const trimmed = line.trim();
  const instructions = []
  if(!trimmed) return instructions
  const regex = /move (\d+) from (\d) to (\d)/;
  const [_, count, from, to] = regex.exec(line);
  for(var i = 0; i < Number(count); i++) {
    instructions.push({number: 1, from: Number(from), to: Number(to)})
  }
  return instructions
}
const parseInstructionPart2 = (line) => {
  const trimmed = line.trim();
  const instructions = []
  if(!trimmed) return instructions
  const regex = /move (\d+) from (\d) to (\d)/;
  const [_, count, from, to] = regex.exec(line);
  instructions.push({number: count, from: Number(from), to: Number(to)})
  return instructions
}
const readTopOfStack = (state) => {
  let message = '';
  for(var i = 0; i < state.length; i++) {
    message += state[i][state[i].length-1]
  }
  return message;
}
const cloneStacks = (stacks) => {
  const newStacks = [];
  for(var i = 0; i < stacks.length; i++) {
    newStacks.push([...stacks[i]])
  }
  return newStacks
}

module.exports = (input) => {
  const crateInput = input.split('\n');
  const crates = crateInput.splice(0, 9).reverse();
  const indices = generateIndices(crates.splice(0,1).toString())
  const stacks = buildStacks(crates, indices);
  const newState1 = crateInput.reduce((state, inst) => {
    const instruction = parseInstructionPart1(inst);
    if(instruction) {
      for(var i = 0; i < instruction.length; i++) {
        const removed = state[instruction[i].from-1].splice(-(instruction[i].number));
        state[instruction[i].to-1] = state[instruction[i].to-1].concat(removed);
      }
    }
    return state
  }, cloneStacks(stacks));
  answer(readTopOfStack(newState1), 1)
  const newState2 = crateInput.reduce((state, inst) => {
    const instruction = parseInstructionPart2(inst);
    if(instruction) {
      for(var i = 0; i < instruction.length; i++) {
        const removed = state[instruction[i].from-1].splice(-(instruction[i].number));
        state[instruction[i].to-1] = state[instruction[i].to-1].concat(removed);
      }
    }
    return state
  }, cloneStacks(stacks));
  answer(readTopOfStack(newState2), 2)
  // const result = elfPairings.reduce((memo, entry) => {
   
  //   return memo;
  // }, {all: 0, some: 0})
  // answer(result.all, 1);
  // answer(result.some, 2);
}