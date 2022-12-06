const {answer, debug} = require('../logger');

const allElementsDifferent = (array) => {
  return new Set(array).size === array.length;
}

module.exports = (datastream) => {
  const array = datastream.split('');
  const packetBuffer = [];
  const messageBuffer = [];
  let foundPacketSignal = false;
  let foundMessageSignal = false;
  array.reduce((count, character) => {
    packetBuffer.push(character);
    if(packetBuffer.length > 4) {
      packetBuffer.shift();
      if(!foundPacketSignal && allElementsDifferent(packetBuffer)) {
        foundPacketSignal = true;
        answer(count+1, 1);
      }
    }
    messageBuffer.push(character);
    if(messageBuffer.length > 14) {
      messageBuffer.shift();
      if(!foundMessageSignal && allElementsDifferent(messageBuffer)) {
        foundMessageSignal = true;
        answer(count+1, 2);
      }
    }
    return count+1;
  }, 0)
}