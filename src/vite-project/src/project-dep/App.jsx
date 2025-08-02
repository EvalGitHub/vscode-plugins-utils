/* eslint-disable no-undef */
import { useState } from 'react'
import { Table,Button } from 'antd';
import './App.css'
import { useEffect } from 'react';

function App() {
  const [dataSource, setDataSource] = useState([
    {
      number: '1',
      source: '胡彦斌',
      version: 32,
      address: '西湖区湖底公园1号',
    },
    {
      number: 'source',
      source: '胡彦祖',
      version: 42,
      address: '西湖区湖底公园1号',
    },
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
    // ✅ 安全检查
    const vscode = acquireVsCodeApi();
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
