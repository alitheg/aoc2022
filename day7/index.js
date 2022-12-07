const {answer, debug} = require('../logger');

const CMD_PREFIX = "$";
const capacity = 70000000;

const cd = (dir, meta) => {
  switch(dir) {
    case('/'):
      meta.cwd = ['/']
      break;
    case('..'):
      meta.cwd.pop();
      break;
    default:
      meta.cwd.push(dir);
  }
  return meta;
}

const ls = (meta) => {
  meta.buffer.forEach(entry => {
    let parts = entry.split(' ')
    let current;
    meta.cwd.forEach((part, ix) => {
      if(ix === 0) current = meta.tree[part]
      else current = current[part]
    })
    if(parts[0] == 'dir') {
      current[parts[1]] = {};
    } else {
      current[parts[1]] = {name: parts[1], size: Number(parts[0])}
    }
  });
  meta.pendingLs = false;
  return meta;
}

const traverseFileSystem = (node) => {
  if(!node) return 0;
  if(!node.size) node.size = 0;
  if(Object.hasOwnProperty.call(node, 'name')) {
    node.type = 'file'
    return node.size;
  } else {
    node.type = 'dir'
    for (const entry in node) {
      if (Object.hasOwnProperty.call(node, entry) &&  !['name', 'size', 'type'].includes(entry)) {
        const newNode = node[entry];
        node.size += traverseFileSystem(newNode)
      }
    }
    return node.size;
  }
}

const findDirsPart1 = (fs) => {
  return Object.keys(fs).reduce((list, nodeName)=>{
    const curNode = fs[nodeName]
    if(curNode.type == "dir") {
      if(curNode.size <= 100000) {
        list.push(curNode)
      }
      return list.concat(findDirsPart1(curNode));
    } else return list;
  }, []);
}

const findDirsPart2 = (fs, requiredSize) => {
  return Object.keys(fs).reduce((list, nodeName)=>{
    const curNode = fs[nodeName]
    if(curNode.type == "dir") {
      if(curNode.size >= requiredSize) {
        list.push(curNode)
      }
      return list.concat(findDirsPart2(curNode, requiredSize));
    } else return list;
  }, []);
}

const process = (fs) => {
  traverseFileSystem(fs.tree);
  return findDirsPart1(fs.tree);
}

module.exports = (commandStream) => {
  const commands = commandStream.split('\n');
  let fileSystem = commands.reduce((meta, entry) => {
    if(entry.charAt(0) === CMD_PREFIX) {
      if(meta.pendingLs) {
        meta = ls(meta)
      }
      meta.buffer = [];
      let cmd = entry.slice(1).trim();
      let parts = cmd.split(' ');
      switch(parts[0]) {
        case('cd'):
          cd(parts[1], meta);
          break;
        case('ls'):
          meta.pendingLs = true
          break;
      }
    } else {
      meta.buffer.push(entry);
    }
    return meta;
  }, {pendingLs: false, buffer: [], cwd: [], tree: {'/': {}}})
  if(fileSystem.pendingLs && fileSystem.buffer.length > 0) {
    fileSystem = ls(fileSystem);
    fileSystem.buffer = [];
  }
  const result = process(fileSystem);
  // debug(JSON.stringify(fileSystem.tree))
  const r = result.reduce((total, dir) => {
    return total + dir.size
  }, 0)
  answer(r, 1);
  const totalFsSize = fileSystem.tree.size;
  const remaining = capacity - totalFsSize;
  const required = 30000000 - remaining;
  const candidateDirectories = findDirsPart2(fileSystem.tree, required);
  candidateDirectories.sort((a, b)=>a.size-b.size);
  answer(candidateDirectories[0].size, 2)
  
}