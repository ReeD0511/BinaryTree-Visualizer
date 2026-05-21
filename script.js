// 获取 DOM 元素
const inputData = document.getElementById('input-data');
const btnBuild = document.getElementById('btn-build');
const treeVisual = document.getElementById('tree-visual');
const analysisResult = document.getElementById('analysis-result');

const searchTarget = document.getElementById('search-target');
const btnSearch = document.getElementById('btn-search');
const searchResult = document.getElementById('search-result');

// 绑定“构建”按钮点击事件
btnBuild.addEventListener('click', () => {
    const rawData = inputData.value;
    console.log("获取到的输入数据:", rawData);
    treeVisual.textContent = "准备就绪！下一步我们将在这里渲染树...\n获取到的数据是：" + rawData;
    analysisResult.textContent = "等待核心算法接入...";
});

// 绑定“查找”按钮点击事件
btnSearch.addEventListener('click', () => {
    const target = searchTarget.value;
    if (!target) {
        searchResult.textContent = "请输入目标值！";
        return;
    }
    searchResult.textContent = `准备查找目标值: ${target}`;
});
