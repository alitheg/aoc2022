const winston = require('winston');
const { format, transports } = require('winston');
const { combine } = format;
const { download } = require('./downloader')

winston.configure({
  format: combine(
    format.cli({ colors: { info: 'blue', error: 'red' }})
  ),
  transports: [new transports.Console()]
});

const optionDefinitions = [
  { name: 'day', alias: 'd', type: Number },
  // { name: 'input', alias: 'i', type: String }
]

const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)

let error = false;
if(!options.day) {
  winston.error("Specify which day to run with -d")
  error = true;
} 
// if(!options.input) {
//   winston.error("Specify the input file with -i")
//   error = true;
// } 
if(error) {
  process.exit(1);
}

async function main() {
  let task;
  switch(options.day) {
    case(1):
      task = require('./day1');
      break;
    case(2):
      task = require('./day2');
      break;
    case(3):
      task = require('./day3');
      break;
    case(4):
      task = require('./day4');
      break;
    case(5):
      task = require('./day5');
      break;
    case(6):
      task = require('./day6');
      break;
    case(7):
      task = require('./day7');
      break;
    case(8):
      task = require('./day8');
      break;
    case(9):
      task = require('./day9');
      break;
    case(10):
      task = require('./day10');
      break;
  }
  winston.info(`Downloading input task for day ${options.day}`);
  const input = download(options.day).then(input => {
    winston.info(`Starting task for day ${options.day}`);
    task(input)
    winston.info(`Finished`);
  });
  
}

main()
