const {answer, debug} = require('../logger');

const processRow = (row, rowRef, colRef) => {
  const forward = row.reduce((visible, tree, ix) => {
    if(tree && visible.every(v => v.height < tree)) {
      visible.push({height: tree, rowIndex: rowRef == null ? ix : rowRef, colIndex: colRef == null ? ix : colRef});
    }
    return visible;
  }, []);
  const backward = [...row].reverse().reduce((visible, tree, ix) => {
    if(tree && visible.every(v => v.height < tree)) {
      visible.push({height: tree, rowIndex: rowRef == null ? row.length - 1 - ix : rowRef, colIndex: colRef == null ? row.length - 1 - ix : colRef});
    }
    return visible;
  }, []);
  return forward.concat(backward.filter(b => !forward.some(f => f.rowIndex == b.rowIndex && f.colIndex == b.colIndex)).reverse());
}

const calcScenicScore = (height, colIndex, rowIndex, row, col) => {
  let rowScoreLeft = 0;
  let rowScoreRight = 0;
  let colScoreLeft = 0;
  let colScoreRight = 0;
  if(rowIndex == 0 || rowIndex == col.length-1 || colIndex == 0 || colIndex == row.length - 1) {
    return 0;
  }
  for(let i = colIndex-1; i >= 0; i--) {
    rowScoreLeft++
    if(row[i] >= height) {
      break;
    }
  }
  for(let i = colIndex+1; i < row.length; i++) {
    rowScoreRight++
    if(row[i] >= height) {
      break;
    }
  }
  for(let i = rowIndex-1; i >= 0; i--) {
    colScoreLeft++
    if(col[i] >= height) {
      break;
    }
  }
  for(let i = rowIndex+1; i < col.length; i++) {
    colScoreRight++
    if(col[i] >= height) {
      break;
    }
  }
  return rowScoreLeft*rowScoreRight*colScoreLeft*colScoreRight;
}

module.exports = (trees) => {
  const treeRows = trees.split('\n').map(row => row.split(''));
  const treeCols = treeRows[0].map((_, colIndex) => treeRows.map(row => row[colIndex]));
  debug(`Rows: ${treeCols.length}, Cols: ${treeRows.length}`)
  let visibleTrees = []
  for(let i = 0; i < treeRows.length; i++) {
    visibleTrees = visibleTrees.concat(processRow(treeRows[i], i, null))
  }  
  for(let i = 0; i < treeCols.length; i++) {
    visibleTrees = visibleTrees.concat(processRow(treeCols[i], null, i).filter(t => !visibleTrees.some(v => v.rowIndex == t.rowIndex && v.colIndex == t.colIndex)))
  }
  answer(visibleTrees.length, 1)
  const bestScenicScore = treeRows[0].reduce((best, _, colIndex) => {
    return treeCols[0].reduce((b, _, rowIndex) => {
      if(treeRows[colIndex][rowIndex]) {
        let scenicScore = calcScenicScore(treeRows[colIndex][rowIndex],rowIndex,colIndex,treeRows[colIndex],treeCols[rowIndex]);
        return Math.max(b, scenicScore);
      } else {
        return b
      }
    }, best)
  }, 0)
  answer(bestScenicScore, 2)
}