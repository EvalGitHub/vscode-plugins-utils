import fsExtra from 'fs-extra';
import * as vscode from 'vscode';
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

export async function updateDep( path:string,
  depItem:any,
  cwd:string, 
  callFun:() => void) {
    depItem.value.name;
    if (!fsExtra.existsSync(path)) {
      return vscode.window.showErrorMessage('node_modules不存在，请先安装依赖!');
    }
    const isDev = depItem.value.tag === 'devDependencies' ? '-S' : '';
    // spawnSync("tnpm", ['update' ,isDev, depItem.value.name], {
    //   cwd,
    //   stdio: 'inherit'
    // });
    exec(`tnpm update ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      if (error) {
        vscode.window.showErrorMessage(`执行 tnpm update ${isDev} ${depItem.value.name} 失败！`);
      } else {
        vscode.window.showInformationMessage(`执行 tnpm update ${isDev} ${depItem.value.name} 成功！`);
        callFun && callFun();
      }
    });
}

export function deleteDep(
  path:string,
  depItem:any,
  cwd:string,
  callFun:() => void) {
    if (!fsExtra.existsSync(path)) {
      return vscode.window.showErrorMessage('node_modules不存在，请先安装依赖!');
    }
    const isDev = depItem.value.tag === 'devDependencies' ? '-D' : '';
  /*   spawnSync("tnpm", ['uninstall', isDev ,depItem.value.name ], {
      cwd,
      stdio: 'inherit'
    }); */
    exec(`tnpm uninstall ${isDev} ${depItem.value.name}`,{ cwd},function(error) {
      if (error) {
        vscode.window.showErrorMessage(`执行 tnpm uninstall ${isDev} ${depItem.value.name} 失败！`);
      } else {
        vscode.window.showInformationMessage(`执行 tnpm uninstall ${isDev} ${depItem.value.name} 成功！`);
        callFun && callFun();
      }
    });
}