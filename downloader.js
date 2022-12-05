const fetch = require('node-fetch');
const fs = require("fs");

const SESSION = fs.readFileSync('./.session')

async function fetchFile(url){
  return await fetch(url, 
    {
      headers: 
      {
        Cookie: `session=${SESSION}`
      }
    }
  ).then(res => res.text())
}

const download = async (day) => {
  return await fetchFile(`https://adventofcode.com/2022/day/${day}/input`)
}

module.exports = {
  download
}