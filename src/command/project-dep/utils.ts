import fsExtra from 'fs-extra';
import * as vscode from 'vscode';
import {spawnSync} from 'child_process';

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