const {answer, debug} = require('../logger');

const priorities = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const calculatePriority = (item) => {
  return priorities.indexOf(item)+1
}

const calculateContents = (vector) => {
  const allItems = vector.split('');
  // debug(`vector: ${vector}, items: ${allItems}`)
  const rucksack = {all: vector.split(''), box1: [], box2: []};
  const numItems = allItems.length/2;
  rucksack.box1 = allItems.splice(0, numItems);
  rucksack.box2 = allItems;
  return rucksack
}

const findSharedItems = (collection1, collection2) => {
  return [...new Set(collection1.filter(value => collection2.includes(value)))];
}
const findSharedItems3 = (collection1, collection2, collection3) => {
  return [...new Set(collection1.filter(value => collection2.includes(value) && collection3.includes(value)))];
}

const findBadgeItem = (rucksack1, rucksack2, rucksack3) => {
  return findSharedItems3(rucksack1.all, rucksack2.all, rucksack3.all);
}


module.exports = (input) => {
  const rucksackContents = input.split('\n');
  const elfRucksacks = []
  const result = rucksackContents.reduce((memo, entry) => {
    if(entry.trim().length === 0) return memo;
    const rucksack = calculateContents(entry);
    elfRucksacks.push(rucksack);
    // debug(JSON.stringify(rucksack))
    const sharedItems = findSharedItems(rucksack.box1, rucksack.box2);
    // debug(JSON.stringify(sharedItems))
    const priority = calculatePriority(sharedItems[0]);
    return memo + priority;
  }, 0)
  answer(result, 1);
  const badges = elfRucksacks.reduce((memo, entry, index) => {
    memo.group.push(entry);
    if(index % 3 === 2) {
      const badge = findBadgeItem(...memo.group);
      memo.sum += calculatePriority(badge);
      memo.group = [];
    }
    return memo;
  }, { group: [], sum: 0 });
  answer(badges.sum, 2);
}