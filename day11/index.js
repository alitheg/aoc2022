const {answer, debug} = require('../logger');

const buildMonkey = (rows) => {
  debug(rows[0]);
  const [_, monkeyNumber] = /Monkey (\d+):/.exec(rows[0]);
  debug(rows[1]);
  const [__, itemArray] = /Starting items: (.+)$/.exec(rows[1]);
  const items = itemArray.split(',').map(n => BigInt(n.trim())/1000n)
  debug(rows[2]);
  const [___, operation, operand] = /Operation: new = old ([+\-*/]) (\d+|old)$/.exec(rows[2]);
  const opFn = (old) => {
    let argument = operand;
    if(argument == 'old') {
      argument = old;
    }
    switch(operation) {
      case('+'):
        return old + BigInt(argument)/1000n;
      case('-'):
        return old - BigInt(argument)/1000n;
      case('*'):
        return old * BigInt(argument)/1000n;
      case('/'):
        return old / BigInt(argument)/1000n;
    }
  };
  debug(rows[3]);
  const [____, test] = /Test: divisible by (\d+)$/.exec(rows[3]);
  const testFn = (worry) => {
    return worry % BigInt(test) === 0n;
  }
  debug(rows[4]);
  const [_____, destinationIfTrue] = /If true: throw to monkey (\d+)$/.exec(rows[4]);
  debug(rows[5]);
  const [______, destinationIfFalse] = /If false: throw to monkey (\d+)$/.exec(rows[5]);
  return {monkey: monkeyNumber, activity: 0, items, operation: opFn, test: testFn, trueDest: Number(destinationIfTrue), falseDest: Number(destinationIfFalse)};
}

const cloneMonkeys = (monkeys) => {
  const newMonkeys = [];
  for(var i = 0; i < monkeys.length; i++) {
    newMonkeys.push(Object.assign({}, monkeys[i], {
      items: [...monkeys[i].items]
    })
    )
  }
  return newMonkeys
}

module.exports = (monkeyInfo) => {
  let monkeyMeta = monkeyInfo.split('\n');
  // monkeyMeta.push('');
  const {monkeys} = monkeyMeta.reduce((memo, row) => {
    if(row.trim() == '') {
      memo.monkeys.push(buildMonkey(memo.buffer));
      memo.buffer = [];
    } else {
      memo.buffer.push(row);
    }
    return memo;
  }, {buffer: [], monkeys: []});
  const part2Monkeys = cloneMonkeys(monkeys);
  // 20 rounds
  for(let round = 0; round < 20; round++) {
    // Round
    debug(`Round ${round}`);
    for(let monkey of monkeys) {
      // Monkey turn
      debug(`Monkey ${monkey.monkey} takes a turn`);
      while(monkey.items.length > 0) {
        let item = monkey.items.shift();
        debug(`Monkey inspects an item with a worry level of ${item}`);
        item = monkey.operation(item);
        monkey.activity = monkey.activity + 1;
        debug(`Worry level changes to ${item}`);
        item = item/3n
        debug(`Monkey gets bored with item. Worry level is divided by 3 to ${item}.`);
        if(monkey.test(item)) {
          debug(`Current worry level is divisible`);
          debug(`Item with worry level ${item} is thrown to monkey ${monkey.trueDest}`);
          monkeys[monkey.trueDest].items.push(item);
        }
        else {
          debug(`Current worry level is not divisible`);
          debug(`Item with worry level ${item} is thrown to monkey ${monkey.falseDest}`);
          monkeys[monkey.falseDest].items.push(item);
        }
      }
    }
    debug(`After round ${round}, the monkeys are holding items with these worry levels:`);
    for(let monkey of monkeys) {
      debug(`Monkey ${monkey.monkey}: ${monkey.items.join(', ')}`);
    }    
    for(let monkey of monkeys) {
      debug(`Monkey ${monkey.monkey} inspected items ${monkey.activity} times`);
    }
  }
  const monkeyBusiness = monkeys.map(m => m.activity).sort((a,b)=>a-b).splice(-2).reduce((p, a)=>p*a);
  answer(monkeyBusiness, 1);
  // 10000 rounds
  for(let round = 0; round < 10000; round++) {
    // Round
    debug(`Round ${round}`);
    for(let monkey of part2Monkeys) {
      // debug(`Monkey ${monkey.monkey} takes a turn`);
      // Monkey turn
      while(monkey.items.length > 0) {
        let item = monkey.items.shift();
        // debug(`Monkey inspects an item with a worry level of ${item}`);
        item = monkey.operation(item);
        monkey.activity = monkey.activity + 1;
        // debug(`Worry level changes to ${item}`);
        // No relief this time!
        //item = Math.floor(item/3)
        if(monkey.test(item)) {
          // debug(`Current worry level is divisible`);
          // debug(`Item with worry level ${item} is thrown to monkey ${monkey.trueDest}`);
          part2Monkeys[monkey.trueDest].items.push(item);
        }
        else {
          // debug(`Current worry level is not divisible`);
          // debug(`Item with worry level ${item} is thrown to monkey ${monkey.falseDest}`);
          part2Monkeys[monkey.falseDest].items.push(item);
        }
      }
    }
    if([0, 19, 999, 1999, 2999, 3999, 4999, 5999, 6999, 7999, 8999, 9999].includes(round)) {
      debug(`After round ${round}, the monkeys are holding items with these worry levels:`);
      for(let monkey of part2Monkeys) {
        debug(`Monkey ${monkey.monkey} inspected items ${monkey.activity} times`);
      } 
    }
  }
  const monkeyMadness = part2Monkeys.map(m => m.activity).sort((a,b)=>a-b).splice(-2).reduce((p, a)=>p*a);
  answer(monkeyMadness, 2);
}