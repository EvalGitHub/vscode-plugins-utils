import fsExtra from 'fs-extra';
import * as vscode from 'vscode';
import which from 'which';
import {spawnSync, exec} from 'child_process';

export function loadJson(filepath:string) {
  if (!fsExtra.existsSync(filepath)) {
    return vscode.window.showErrorMessage('不存在package.json文件，执行报错!');
  }
  return fsExtra.readJson(filepath);
}

export function handleDep(pkgJson:any) {
  let depListTmp:any = [];
  if (pkgJson.dependencies) {
    depListTmp =[...Object.keys(pkgJson.dependencies)]?.reduce((pre:any, cur) => {
      pre.push({
        tag: "dependencies",
        version: pkgJson.dependencies[cur],
        name: cur,
      });
      return pre;
    }, []);
  }
  if (pkgJson.devDependencies) {
    [...Object.keys(pkgJson.devDependencies)]?.reduce((pre, cur) => {
      pre.push({
        tag: "devDependencies",
        version: pkgJson.devDependencies[cur],
        name: cur,
      });
      return pre;
    }, depListTmp);
  }
  return depListTmp;
}

export function getDepItemByPksJon(depName:string, pkgJson:any) {
  const pkgJSONDepObj = {...pkgJson.dependencies, ...pkgJson.devDependencies};
  return pkgJSONDepObj[depName];
}

export function createDepTable(depList:Array<any>, ) {
  return depList;
}

export function viewDepSourceCode(
  path:string,
  depName:string,
  cwd:string
) {
  if (!fsExtra.existsSync(path)) {
    return vscode.window.showErrorMessage('node_modules不存在，请先安装依赖!');
  }
  spawnSync("code", ['node_modules/' + depName], {
    cwd,
    stdio: 'inherit'
  });
}

export function getNpmOrTnpm() {
  let targetNpm = '';
  try {
    // 使用which模块检查命令是否存在
    which.sync("tnpm");
    targetNpm = "tnpm";
  } catch (error) {
    targetNpm = "npm";
  }
  return targetNpm;
}

export async function updateDep( path:string,
  depItem:any,
  cwd:string, 
  callFun:(item:any, status:string) => void) {
    depItem.value.name;
    if (!fsExtra.existsSync(path)) {
      return vscode.window.showErrorMessage('node_modules不存在，请先安装依赖!');
    }
    const isDev = depItem.value.tag === 'devDependencies' ? '-S' : '';
    // spawnSync("tnpm", ['update' ,isDev, depItem.value.name], {
    //   cwd,
    //   stdio: 'inherit'
    // });
    depItem.isUpdating = true;
    callFun && callFun(depItem, 'handling');
    exec(`${getNpmOrTnpm()} update ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      depItem.isUpdating = false;
      if (error) {
        callFun && callFun(depItem, 'fail');
        vscode.window.showErrorMessage(`执行 ${getNpmOrTnpm()} update ${isDev} ${depItem.value.name} 失败！`);
      } else {
        vscode.window.showInformationMessage(`执行 ${getNpmOrTnpm()} update ${isDev} ${depItem.value.name} 成功！`);
        callFun && callFun(depItem, 'success');
      }
    });
}

export function deleteDep(
  path:string,
  depItem:any,
  cwd:string,
  callFun:(item:any, status:string) => void) {
    if (!fsExtra.existsSync(path)) {
      return vscode.window.showErrorMessage('node_modules不存在，请先安装依赖!');
    }
    const isDev = depItem.value.tag === 'devDependencies' ? '-D' : '';
  /*   spawnSync("tnpm", ['uninstall', isDev ,depItem.value.name ], {
      cwd,
      stdio: 'inherit'
    }); */
    depItem.isDeleting = true;
    callFun && callFun(depItem, 'handling');
    exec(`${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      depItem.isDeleting = false;
      if (error) {
        vscode.window.showErrorMessage(`执行 ${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name} 失败！`);
        callFun && callFun(depItem, 'fail');
      } else {
        vscode.window.showInformationMessage(`执行 ${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name} 成功！`);
        callFun && callFun(depItem, 'success');
      }
    });
}