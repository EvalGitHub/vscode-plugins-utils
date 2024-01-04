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
    ele.innerHTML = '';
    const fragment = new DocumentFragment();
    data.forEach((item, index) => {
      item.action = 'actionFlag';
      const trEle = document.createElement('tr');  
      const tdEle = document.createElement('td');
      tdEle.textContent = index;
      trEle.appendChild(tdEle);

      const keysArr = Object.keys(item);
      keysArr.forEach((cellKey, cellIndex) => {
        if (cellIndex === keysArr.length -1) { // 检查是否是最后一列  
          const tdEle = document.createElement('td');
         
          const viewEle = document.createElement('span');
          viewEle.className = 'action-link';
          viewEle.addEventListener('click', function() {
            actionDepSourceCode(item, 'view');
          });
          viewEle.textContent="查看源码";
          tdEle.appendChild(viewEle);

          const updateEle = document.createElement('span');
          updateEle.className = 'action-link margin-left-10';
          updateEle.addEventListener('click', function() {
            actionDepSourceCode(item, 'update');
          });
          updateEle.textContent="更新";
          tdEle.appendChild(updateEle);

          const deleteEle = document.createElement('span');
          deleteEle.className = 'action-link margin-left-10';
          deleteEle.addEventListener('click', function() {
            actionDepSourceCode(item, 'delete');
          });
          deleteEle.textContent="删除";
          tdEle.appendChild(deleteEle);
          trEle.appendChild(tdEle);
        } else {
          const tdEle = document.createElement('td');
          tdEle.textContent = item[cellKey];
          trEle.appendChild(tdEle);
        }
      }); 
      // ele.appendChild(trEle);
      fragment.appendChild(trEle);
    });
    ele.appendChild(fragment);
  }

  function actionDepSourceCode(item, action) {
    vscode.postMessage({ type: action, value: item });
  }
}());