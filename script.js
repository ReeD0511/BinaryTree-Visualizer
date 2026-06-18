// ================= 1. 获取 DOM 元素 =================
const inputData = document.getElementById('input-data');
const btnBuild = document.getElementById('btn-build');
const treeVisual = document.getElementById('tree-visual');
const analysisResult = document.getElementById('analysis-result');
const searchTarget = document.getElementById('search-target');
const btnSearch = document.getElementById('btn-search');
const searchResult = document.getElementById('search-result');

class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}
let rootNode = null; 

// ================= 2. 层序构建二叉树 =================
function buildTree(arr) {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    let root = new TreeNode(arr[0]);
    let queue = [root]; 
    let i = 1;
    while (i < arr.length) {
        let curr = queue.shift();
        if (arr[i] !== null && arr[i] !== undefined) {
            curr.left = new TreeNode(arr[i]);
            queue.push(curr.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = new TreeNode(arr[i]);
            queue.push(curr.right);
        }
        i++;
    }
    return root;
}

// ================= 3. 树形可视化输出 (侧向树结构生成) =================
function printTreeText(node, prefix = "", isLeft = true, isRoot = true) {
    if (!node) return "";
    let str = "";
    // 先递归打印右子树（在上方）
    if (node.right) {
        str += printTreeText(node.right, prefix + (isLeft && !isRoot ? "│   " : "    "), false, false);
    }
    // 打印当前节点
    str += prefix + (isRoot ? "" : (isLeft ? "└── " : "┌── ")) + node.val + "\n";
    // 再递归打印左子树（在下方）
    if (node.left) {
        str += printTreeText(node.left, prefix + (!isLeft && !isRoot ? "│   " : "    "), true, false);
    }
    return str;
}

// ================= 4. 遍历、分析与性质判断 =================
function analyzeTree(root) {
    if (!root) return "是否为空树：是";
    let preOrder = [], inOrder = [], postOrder = [], levelOrder = [];
    let totalNodes = 0, leafNodes = 0, levelCounts = [], maxHeight = 0, maxWidth = 0;

    function dfs(node) {
        if (!node) return;
        preOrder.push(node.val);
        dfs(node.left);
        inOrder.push(node.val);
        if (!node.left && !node.right) leafNodes++;
        totalNodes++;
        dfs(node.right);
        postOrder.push(node.val);
    }
    dfs(root);

    let queue = [root];
    while (queue.length > 0) {
        let size = queue.length;
        maxWidth = Math.max(maxWidth, size);
        levelCounts.push(size);
        maxHeight++;
        for (let i = 0; i < size; i++) {
            let curr = queue.shift();
            levelOrder.push(curr.val);
            if (curr.left) queue.push(curr.left);
            if (curr.right) queue.push(curr.right);
        }
    }

    let isFull = true;
    function checkFull(node) {
        if (!node) return;
        if ((node.left && !node.right) || (!node.left && node.right)) isFull = false;
        checkFull(node.left);
        checkFull(node.right);
    }
    checkFull(root);

    let isComplete = true, cq = [root], end = false;
    while (cq.length > 0) {
        let curr = cq.shift();
        if (curr === null) end = true;
        else {
            if (end) isComplete = false;
            cq.push(curr.left);
            cq.push(curr.right);
        }
    }

    let isBalanced = true;
    function checkBalance(node) {
        if (!node) return 0;
        let leftH = checkBalance(node.left);
        let rightH = checkBalance(node.right);
        if (Math.abs(leftH - rightH) > 1) isBalanced = false;
        return Math.max(leftH, rightH) + 1;
    }
    checkBalance(root);

    let isBST = true;
    for (let i = 1; i < inOrder.length; i++) {
        if (inOrder[i] <= inOrder[i - 1]) { isBST = false; break; }
    }

    return `--- 基础遍历 ---
前序遍历：${preOrder.join(' ')}
中序遍历：${inOrder.join(' ')}
后序遍历：${postOrder.join(' ')}
层序遍历：${levelOrder.join(' ')}

--- 结构分析 ---
节点总数：${totalNodes}
叶子节点数量：${leafNodes}
树的高度：${maxHeight}
每一层节点数：[${levelCounts.join(', ')}]
最大宽度：${maxWidth}

--- 性质判断 ---
是否为空树：否
是否为满二叉树：${isFull ? "是" : "否"}
是否为完全二叉树：${isComplete ? "是" : "否"}
是否为平衡二叉树：${isBalanced ? "是" : "否"}
是否为二叉搜索树：${isBST ? "是" : "否"}`;
}

// ================= 5. 绑定“构建”按钮 =================
btnBuild.addEventListener('click', () => {
    let rawStr = inputData.value;
    let cleanedStr = rawStr.replace(/[\[\]]/g, ''); 
    let arr = cleanedStr.split(',').map(item => {
        let val = item.trim().toLowerCase();
        return (val === 'null' || val === '') ? null : Number(val);
    });
    
    rootNode = buildTree(arr);
    analysisResult.textContent = analyzeTree(rootNode);
    // 渲染完美的字符树
    treeVisual.textContent = printTreeText(rootNode);
});

// ================= 6. 绑定“查找”按钮 =================
btnSearch.addEventListener('click', () => {
    if (!rootNode) return searchResult.textContent = "⚠️ 请先构建二叉树！";
    if (searchTarget.value.trim() === '') return searchResult.textContent = "⚠️ 请输入目标值！";

    const target = Number(searchTarget.value);
    let path = [], found = false;

    function findPath(node, val, currentPath) {
        if (!node || found) return;
        currentPath.push(node.val); 
        if (node.val === val) {
            found = true;
            path = [...currentPath]; 
            return;
        }
        findPath(node.left, val, currentPath);
        findPath(node.right, val, currentPath);
        currentPath.pop(); 
    }
    findPath(rootNode, target, []);

    if (found) {
        searchResult.textContent = `✅ 查找结果：目标值 ${target} 存在\n📍 节点路径：${path.join(' -> ')}\n🏢 所在层数：${path.length}`;
    } else {
        searchResult.textContent = `❌ 查找结果：目标值 ${target} 不存在。`;
    }
});