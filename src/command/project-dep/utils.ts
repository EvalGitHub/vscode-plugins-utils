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

export function getDepItemByPksJon(depItem:any, pkgJson:any) {
  // const pkgJSONDepObj = {...pkgJson.dependencies, ...pkgJson.devDependencies};
  if (depItem.tag === 'dependencies') {
    return {
      name: depItem.name,
      tag: depItem.tag,
      version: pkgJson.dependencies[depItem.name]
    }; 
  } else {
    return {
      name: depItem.name,
      tag: depItem.tag,
      version: pkgJson.devDependencies[depItem.name]
    }; 
  }
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
    const isDev = depItem.value.tag === 'devDependencies' ? '-D' : '-S';
    // spawnSync("tnpm", ['update' ,isDev, depItem.value.name], {
    //   cwd,
    //   stdio: 'inherit'
    // });
    depItem.isUpdating = "pending";
    setTimeout(()=> {
      callFun && callFun(depItem, 'handling');
    }, 100);
    exec(`${getNpmOrTnpm()} update ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      depItem.isUpdating = false;
      if (error) {
        depItem.isUpdating = "failure";
        callFun && callFun(depItem, 'fail');
        vscode.window.showErrorMessage(`执行 ${getNpmOrTnpm()} update ${isDev} ${depItem.value.name} 失败！${error.message}`);
      } else {
        depItem.isUpdating = "success";
        vscode.window.showInformationMessage(`执行 ${getNpmOrTnpm()} update ${isDev} ${depItem.value.name} 成功！`);
        setTimeout(()=> {
          callFun && callFun(depItem, 'success');
        }, 100);
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
    const isDev = depItem.value.tag === 'devDependencies' ? '' : '';
  /*   spawnSync("tnpm", ['uninstall', isDev ,depItem.value.name ], {
      cwd,
      stdio: 'inherit'
    }); */
    depItem.isDeleting = "pending";
    setTimeout(()=> {
      callFun && callFun(depItem, 'handling');
    }, 100);
    exec(`${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      if (error) {
        depItem.isDeleting = "failure";
        vscode.window.showErrorMessage(`执行 ${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name} 失败！${error.message}`);
        callFun && callFun(depItem, 'fail');
      } else {
        depItem.isDeleting = "success";
        vscode.window.showInformationMessage(`执行 ${getNpmOrTnpm()} uninstall ${isDev} ${depItem.value.name} 成功！`);
        setTimeout(()=> {
          callFun && callFun(depItem, 'success');
        }, 100);
      }
    });
}