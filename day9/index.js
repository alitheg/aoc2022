const {answer, debug} = require('../logger');

const calculateTailPosition = (head, tail, verbose) => {
  let xDist = head[0]-tail[0];
  let yDist = head[1]-tail[1];
  if(verbose) debug(`xDist: ${xDist}, yDist: ${yDist}`)
  if((xDist == 0 && yDist == 0) || (yDist == 0 && xDist == 0)) {
    if(verbose) debug(`Head: ${head[0]},${head[1]}, Tail: ${tail[0]},${tail[1]}`)
    return tail;
  }
  if((xDist == 0 && Math.abs(yDist) == 1) || (yDist == 0 && Math.abs(xDist) == 1)) {
    if(verbose) debug(`Head: ${head[0]},${head[1]}, Tail: ${tail[0]},${tail[1]}`)
    return tail;
  }
  if(xDist == 0) {
    // Same row
    if(yDist == 2) {
      tail[1]++;
    } 
    if(yDist == -2) {
      tail[1]--;
    }
  } else {
    if(yDist == 0) {
      // Same column
      if(xDist == 2) {
        tail[0]++;
      }    
      if(xDist == -2) {
        tail[0]--;
      }
    } else {
      // Different row and column, but 0/1 and 1/0 already returned
      if(xDist == 2) {
        tail[0]++;
        if(yDist == 1 || yDist == 2) {
          tail[1]++;
        } else {
          if(yDist == -1 || yDist == -2) {
            tail[1]--;
          }
        }
      } else {
        if(xDist == -2) {
          tail[0]--;
          if(yDist == 1 || yDist == 2) {
            tail[1]++;
          } else {
            if(yDist == -1 || yDist == -2) {
              tail[1]--;
            }
          }
        } else {
          if(yDist == 2) {
            tail[1]++;
            if(xDist == 1 || xDist == 2) {
              tail[0]++;
            } else {
              if(xDist == -1 || xDist == -2) {
                tail[0]--;
              }
            }
          } else {
            if(yDist == -2) {
              tail[1]--;
              if(xDist == 1 || xDist == 2) {
                tail[0]++;
              } else {
                if(xDist == -1 || xDist == -2) {
                  tail[0]--;
                }
              }
            }
          }
        }
      }
    }
  }
  if(verbose) debug(`Head: ${head[0]},${head[1]}, Tail: ${tail[0]},${tail[1]}`)
  xDist = head[0]-tail[0];
  yDist = head[1]-tail[1];
  if(verbose) debug(`new xDist: ${xDist}, new yDist: ${yDist}`)
  return tail;
}

module.exports = (motions) => {
  const motionList = motions.split('\n').map(row => {
    const [dir, dist] = row.split(' ');
    return {dir, dist: Number(dist)}
  });
  let head = [0,0];
  let tail = [0,0];
  let visitedPart1 = motionList.reduce((visited, motion) => {
    for(let i = 0; i < motion.dist; i++) {
      // debug(`${motion.dir}`)
      switch(motion.dir) {
        case('L'):
          head[0]--;
          break;
        case('R'):
          head[0]++;
          break;
        case('U'):
          head[1]++;
          break;
        case('D'):
          head[1]--;
          break;
      }
      tail = calculateTailPosition(head, tail, false);
      visited.add(`${tail[0]},${tail[1]}`);
    }
    return visited;
  }, new Set(['0,0']));
  answer(visitedPart1.size, 1)
  let head2 = [100,100];
  let tails = [[100,100], [100,100], [100,100], [100,100], [100,100], [100,100], [100,100], [100,100], [100,100]];
  let visitedPart2 = motionList.reduce(({visited, tails}, motion) => {
    for(let i = 0; i < motion.dist; i++) {
      // debug(`${motion.dir}`)
      switch(motion.dir) {
        case('L'):
          head2[0]--;
          break;
        case('R'):
          head2[0]++;
          break;
        case('U'):
          head2[1]++;
          break;
        case('D'):
          head2[1]--;
          break;
      }
      for(let t = 0; t < tails.length; t++) {
        if(t == 0) {
          tails[t] = calculateTailPosition(head2, tails[t], false);
        } else {
          tails[t] = calculateTailPosition(tails[t-1], tails[t], false);
        }
      }
      // debug(tails);
      visited.add(`${tails[8][0]},${tails[8][1]}`);
    }
    return {visited, tails};
  }, {visited: new Set(['100,100']), tails});
  answer(visitedPart2.visited.size, 1)
}