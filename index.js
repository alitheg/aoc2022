const winston = require('winston');
const { format, transports } = require('winston');
const {promises: {readFile}} = require("fs");
const { combine } = format;
const { download } = require('./downloader')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage');

winston.configure({
  format: combine(
    format.errors({ stack: true }),
    format.cli({ colors: { info: 'blue', error: 'red' }}),
    format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
            // print log trace 
            return `${level}: ${message} - ${stack}`;
        }
        return `${level}: ${message}`;
    })
  ),
  transports: [new transports.Console()]
});

const optionDefinitions = [
  { name: 'day', alias: 'd', type: Number, description: "Which day's task to run" },
  { name: 'file', alias: 'f', type: String, description: "Override file"},
  { name: 'help', alias: 'h', type: Boolean, description: "Display this message" }
]
const sections = [
  {
    header: 'Advent of Code 2022',
    content: 'Solutions to tasks in Node.JS'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]
const usage = commandLineUsage(sections)
const options = commandLineArgs(optionDefinitions)

if(options.help) {
  console.error(usage);
  process.exit(0)
}
let error = false;
if(!options.day) {
  winston.error("Specify which day to run with -d")
  error = true;
} 
if(error) {
  process.exit(1);
}

async function main() {
  let task = require(`./day${options.day}`);
  winston.info(`Downloading input task for day ${options.day}`);
  let fileLoad;
  if(options.file) {
    fileLoad = readFile(options.file).then(data => {
      return data.toString();
    });
  } else {
    fileLoad = download(options.day);
  }
  fileLoad.then(input => {
    winston.info(`Starting task for day ${options.day}`);
    task(input)
    winston.info(`Finished`);
  }).catch(e => {
    winston.error(e);
  });
  
}

main()
