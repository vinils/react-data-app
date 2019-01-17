function loadTreeFunctions (rootNode, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, parentNode = null) {
    if(!rootNode) {
        return;
    }

    rootNode[parentVariableName] = parentNode;
    rootNode.forEachRecursively = (callBackFuncion) => forEachRecursively(rootNode, childsVariableName, callBackFuncion)
    rootNode.parentReducer = (reduceItem, aggregatorCallBack) => parentReduce(rootNode, parentVariableName, reduceItem, aggregatorCallBack);
    rootNode.toArray = () => treeToArray(rootNode, childsVariableName);
    rootNode.findChild = (finderVariableName, keys) => findChild(rootNode, childsVariableName, finderVariableName, keys)
    rootNode.getFull = (elementVariableName) => getFull(rootNode, elementVariableName)

    if(parentNode && rootNode[parentIdVariableName] !== parentNode[nodeIdVariableName]) {
        console.log('node and parent node dont match. rootChildId: ' +  rootNode[nodeIdVariableName])
    }

    if(rootNode[childsVariableName]) {
        rootNode[childsVariableName].forEach(element => {
            loadTreeFunctions(element, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, rootNode)
        })
    }
}

function loadArrayOfTreeFunctions(array, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) {
    array.toArray = () => arrayOfTreeToArrayRecursively(array);

    array.forEach(element => {
        loadTreeFunctions(element, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName)
    })
}

function treeToArray (treeNode) {
    let ret = [treeNode]

    treeNode.forEachRecursively(child => ret.push(child))

    return ret;
}

function arrayOfTreeToArrayRecursively (array) {
    let ret = []

    array.forEach(tree => {
        ret.push(tree)
        tree.forEachRecursively(child => ret.push(child))
    });

    return ret
}
  
function parentReduce (treeNode, parentVariableName, reduceItem, aggregatorCallBack) {
    let ret = aggregatorCallBack(null, reduceItem(treeNode))
    let parent = treeNode[parentVariableName] 

    while(parent) {
        ret = aggregatorCallBack(ret, reduceItem(parent))
        parent = parent[parentVariableName];
    }

    return ret;
}

function treeExtensions(prototype) {
    prototype.parentReducer = function(reduceItem, callBack) {
        return parentReduce(this, 'Parent', reduceItem, callBack)
    }

    prototype.toArray = function() {
        return treeToArray(this, 'Childs')
    }
}

function findChild(node, childsVariableName, finderVariableName, keys, keyIndex = 0) {
    let nextchild = node[childsVariableName].find(child => child[finderVariableName] === keys[keyIndex]);

    if(keyIndex + 1 === keys.length) {
        return nextchild;
    } else {
        return findChild(nextchild, childsVariableName, finderVariableName, keys, keyIndex+1)
    }
}

function getFull(node, elementVariableName, separator = '\\') {
    let reduceItemFn = element => element[elementVariableName];
    let accumulatorFn = (accumulator, currentValue) => accumulator ? currentValue + separator + accumulator : currentValue;
    return node.parentReducer(reduceItemFn, accumulatorFn);
}

function forEachRecursively(node, childsVariableName, callBackFuncion) {
    let callBackFunctionRecursively = (element) => { callBackFuncion(element); forEachRecursively(element, childsVariableName, callBackFuncion); }

    if(node[childsVariableName]) {
        node[childsVariableName]
          .forEach(callBackFunctionRecursively)
    }
}


export { loadTreeFunctions, treeExtensions, loadArrayOfTreeFunctions }
