 
import { useState,useRef } from 'react'
import { Table,Button } from 'antd';
import './App.css'
import { useEffect } from 'react';


let vscodeApi = null;

// 一个安全的获取函数，确保只调用 acquireVsCodeApi 一次
function getVsCodeApi() {
  if (!vscodeApi) {
    try {
      // eslint-disable-next-line no-undef
      vscodeApi = acquireVsCodeApi();
    } catch (e) {
      console.error('Failed to acquire VS Code API:', e);
    }
  }
  return vscodeApi;
}
function App() {
  const vscode = useRef(getVsCodeApi()).current;
  const [dataSource, setDataSource] = useState([
    {
      tag: 'npm',
      version: '1.0.0',
      name: 'example-package',
      isDeleting: 'idle',
      isUpdating: 'idle'
    }
  ]);

  const columns = [
    {
      title: '来源',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
      {
      title: '依赖名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (item) => <div className='button-group'>
        <Button  onClick={() => {
          actionDepSourceCode(item, 'view');
        }}>查看源码</Button>
        <Button loading={item.isDeleting === "pending"} onClick={() => {
         actionDepSourceCode(item, 'delete');
        }}>删除</Button>
        <Button loading={item.isUpdating === 'pending'} onClick={() => {
         actionDepSourceCode(item, 'update');
        }}>更新</Button>
      </div>,
    },
  ];

  function createDepTable(data) {
    setDataSource(data);
  }

  function actionDepSourceCode(item, action) {
    console.log("actionDepSourceCode", item, action);
    // ✅ 安全检查
    if (typeof vscode !== 'undefined' && vscode.postMessage) {
      vscode.postMessage({ type: action, value: item });
    }  else {
      console.warn('vscode 对象不可用，可能不在 VS Code 环境中');
    }
  }

  useEffect(() => {
    // const vscode = acquireVsCodeApi();
    window.addEventListener('message', event => {
      const message = event.data;
      switch(message.type) {
        case 'depContent':
          createDepTable(message.data);
          break;
      }
    });
  }, [])

  return (
    <Table scroll={{ x: 'max-content', y: "100vh" }} 
      dataSource={dataSource} 
      columns={columns}
      pagination={false}
      operate
     />
  )
}

export default App
