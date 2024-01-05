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
      tdEle.textContent = index + 1;
      trEle.appendChild(tdEle);

      const keysArr = ['tag', 'version', 'name'];
      keysArr.forEach((cellKey, cellIndex) => {
        if (cellIndex === keysArr.length -1) { // 检查是否是最后一列  
          const contentEle = document.createElement('td');
          contentEle.textContent = item[cellKey];
          trEle.appendChild(contentEle);

          const tdEle = document.createElement('td');
          const viewEle = document.createElement('span');
          viewEle.className = 'action-link';
          viewEle.addEventListener('click', function() {
            actionDepSourceCode(item, 'view');
          });
          viewEle.textContent="查看源码";
          tdEle.appendChild(viewEle);

          const updateEle = document.createElement('span');
          if (item && item.isDeleting) { // 更新时候不允许删除
            updateEle.className = 'action-link margin-left-10 disable-action';
          } else if (item && item.isUpdating) {
            updateEle.className = 'action-link margin-left-10 loading';
          } else {
            updateEle.className = 'action-link margin-left-10';
          }
          updateEle.addEventListener('click', function() {
            actionDepSourceCode(item, 'update');
            // updateEle.className = 'action-link margin-left-10 loading';
          });
          updateEle.textContent="更新";
          tdEle.appendChild(updateEle);

          const deleteEle = document.createElement('span');
          if (item && item.isUpdating) { // 更新时候不允许删除
            deleteEle.className = 'action-link margin-left-10 disable-action';
          } else if (item && item.isDeleting) {
            deleteEle.className = 'action-link margin-left-10 loading';
          } else {
            deleteEle.className = 'action-link margin-left-10';
          }
          deleteEle.addEventListener('click', function() {
            // deleteEle.className = 'action-link margin-left-10 loading';
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