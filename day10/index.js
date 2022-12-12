const {answer, debug} = require('../logger');

const printScreen = (crt) => {
  for(var line of crt) { 
    debug(line.join(''))
  }
}

module.exports = (instructionList) => {
  const instructions = instructionList.split('\n').map(row => {
    const [instruction, arg] = row.split(' ');
    return {instruction, arg: arg ? Number(arg) : null}
  });
  let currentIx = 0;
  let crt = Array.from({length: 6}, () => {
    const arr = new Array(40);
    arr.fill(' ')
    return arr;
  });
  let state = {crt, beamPos: [0,0], currentCycle: 0, sum: 0, registerX: 1, currentInstruction: null}
  debug('Starting screen:')
  printScreen(state.crt);
  while(currentIx < instructions.length || state.currentInstruction != null) {
    // Start Cycle
    state.currentCycle = state.currentCycle+1;
    state.beamPos[0] = Math.ceil(state.currentCycle / 40) - 1;
    state.beamPos[1] = ((state.currentCycle - 1)  % 40);
    // debug(`Sprite position: ${Array.from({length: 40}, (_, ix) => {
    //   if(ix >= state.registerX - 1 && ix <= state.registerX + 1) {
    //     return '#'
    //   } else {
    //     return '.'
    //   }
    // }).join('')}`)
    debug(`Cycle ${state.currentCycle}, sprite position: ${state.registerX}, beam position: ${state.beamPos[0]}, ${state.beamPos[1]}`)
    // Has the pevious instruction completed?
    if(!state.currentInstruction) {
      if(currentIx < instructions.length) {
        const {instruction, arg} = instructions[currentIx++];
        state.currentInstruction = Object.assign({}, {instruction, arg, startCycle: state.currentCycle});
        debug(`Start ${state.currentInstruction.instruction} ${state.currentInstruction?.arg}`)
      }
    }
    // During Cycle
    // Take the measurements required and draw pixel
    let pixel = '.';
    if(state.beamPos[1] >= state.registerX - 1 && state.beamPos[1] <= state.registerX + 1){
      pixel = '#';
    }
    if(state.crt[state.beamPos[0]] && state.crt[state.beamPos[0]][state.beamPos[1]]) {
      // debug(`Draw ${pixel}`)
      state.crt[state.beamPos[0]][state.beamPos[1]] = pixel;
    }
    // debug(`Current CRT row: ${state.crt[state.beamPos[0]].join('')}`)
    if([20, 60, 100, 140, 180, 220].includes(state.currentCycle)) {
      state.sum += state.registerX * state.currentCycle;
    }

    // End Cycle
    switch(state.currentInstruction.instruction) {
      case('noop'):
        // Noop completes in the same cycle
        debug(`End ${state.currentInstruction.instruction}`)
        state.currentInstruction = null;
        break;
      case('addx'):
        if(state.currentCycle - state.currentInstruction.startCycle == 1) {
          // addx has finished, process it and ready for the next instruction
          state.registerX += state.currentInstruction.arg;
          debug(`End ${state.currentInstruction.instruction} ${state.currentInstruction.arg}`)
          state.currentInstruction = null;
        }
        break; 
      default:
        state.currentInstruction = null;
        break;
    }
  }
  answer(state.sum, 1);
  debug('Ending screen:')
  printScreen(state.crt);
}