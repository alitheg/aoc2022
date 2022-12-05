const {answer, debug} = require('../logger');

const moves = {
  rock: {name: "rock", score: 1},
  paper: {name: "paper", score: 2},
  scissors: {name: "scissors", score: 3}
}
const themMap = {
  A: moves.rock,
  B: moves.paper,
  C: moves.scissors
}
const meMap = {
  X: moves.rock,
  Y: moves.paper,
  Z: moves.scissors,
}
const calculateMePart2 = (them, me) => {
  // X == lose, Z == win
  switch(them.name) {
    case "rock":
      if(me === "X") return moves.scissors
      if(me === "Z") return moves.paper
      break;
    case "paper":
      if(me === "X") return moves.rock
      if(me === "Z") return moves.scissors
      break;
    case "scissors":
      if(me === "X") return moves.paper
      if(me === "Z") return moves.rock
      break;
  }
  // Else draw
  return them;
}

const roundResult = (them, me) => {
  switch(them.name) {
    case "rock":
      if(me.name === "paper") return 1
      if(me.name === "scissors") return -1
      break;
    case "paper":
      if(me.name === "scissors") return 1
      if(me.name === "rock") return -1
      break;
    case "scissors":
      if(me.name === "rock") return 1
      if(me.name === "paper") return -1
      break;
  }
  return 0;
}


const calculateScorePart1 = (them, me) => {
  them = themMap[them.trim()];
  me = meMap[me.trim()];
  // debug(`them ${them.name} me ${me.name}`)
  const result = roundResult(them, me);
  let scores = {them: them.score, me: me.score};
  // debug(JSON.stringify(scores))
  if(result === 1) {
    scores.me += 6
  } 
  if(result === 0) {
    scores.me += 3
    scores.them += 3
  }
  if(result === -1) {
    scores.them += 6
  }
  // debug(JSON.stringify(scores))
  return scores
}
const calculateScorePart2 = (them, me) => {
  them = themMap[them.trim()];
  me = calculateMePart2(them, me);
  // debug(`them ${them.name} me ${me.name}`)
  const result = roundResult(them, me);
  let scores = {them: them.score, me: me.score};
  // debug(JSON.stringify(scores))
  if(result === 1) {
    scores.me += 6
  } 
  if(result === 0) {
    scores.me += 3
    scores.them += 3
  }
  if(result === -1) {
    scores.them += 6
  }
  // debug(JSON.stringify(scores))
  return scores
}

module.exports = (input) => {
  const rounds = input.split('\n');
  const scores1 = rounds.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const [them, me] = entry.split(" ")
    // debug(`them ${them} me ${me}`)
    const roundResult = calculateScorePart1(them, me);
    return {them: memo.them+roundResult.them, me: memo.me+roundResult.me}
  }, {them: 0, me: 0})
  answer(scores1.me, 1);
  const scores2 = rounds.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const [them, me] = entry.split(" ")
    // debug(`them ${them} me ${me}`)
    const roundResult = calculateScorePart2(them, me);
    return {them: memo.them+roundResult.them, me: memo.me+roundResult.me}
  }, {them: 0, me: 0})
  answer(scores2.me, 2);
}