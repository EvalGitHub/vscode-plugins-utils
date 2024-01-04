(function () {
  const vscode = acquireVsCodeApi();
  const ele = document.querySelector(".content-note");
  window.addEventListener('message', event => {
    const message = event.data;
    switch(message.type) {
      case 'depContent':
        createDepTable(message.data);
        break;
    }
  });

  function createDepTable(data) {
    const fragment = new DocumentFragment();
    data.forEach(item => {
      item.action = 'action';
      const trEle = document.createElement('tr');  
      const valuesArr = Object.values(item);
      valuesArr.forEach((rowData, cellIndex) => {
        if (cellIndex === valuesArr.length - 1) { // 检查是否是最后一列  
          const tdEle = document.createElement('td');
         
          const viewEle = document.createElement('span');
          viewEle.className = 'action-link';
          viewEle.addEventListener('click', function() {
            viewDepSourceCode(item);
          });
          viewEle.textContent="查看源码";
          tdEle.appendChild(viewEle);

          const updateEle = document.createElement('span');
          updateEle.className = 'action-link margin-left-10';
          updateEle.addEventListener('click', function() {
            viewDepSourceCode(item);
          });
          updateEle.textContent="更新";
          tdEle.appendChild(updateEle);

          const deleteEle = document.createElement('span');
          deleteEle.className = 'action-link margin-left-10';
          deleteEle.addEventListener('click', function() {
            viewDepSourceCode(item);
          });
          deleteEle.textContent="删除";
          tdEle.appendChild(deleteEle);

          trEle.appendChild(tdEle);
        } else {
          const tdEle = document.createElement('td');
          tdEle.textContent = rowData;
          trEle.appendChild(tdEle);
        }
      }); 
      // ele.appendChild(trEle);
      fragment.appendChild(trEle);
    });
    ele.appendChild(fragment);
  }

  function viewDepSourceCode(item) {
    vscode.postMessage({ type: 'viewDetail', value: item });

  }
}());