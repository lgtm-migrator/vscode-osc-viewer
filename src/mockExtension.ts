import * as vscode from 'vscode';
import * as extension from './extension';
import * as mockAccount from './cloud/mock/account';
import * as mockVms from './cloud/mock/vms';
import * as mockAccessKeys from './cloud/mock/accesskeys';
import * as mockApiAccessRules from './cloud/mock/apiaccessrules';


mockAccount.initMock();
mockVms.initMock();
mockAccessKeys.initMock();
mockApiAccessRules.initMock();


export function activate(context: vscode.ExtensionContext) {
    return extension.activate(context);
}
// this method is called when your extension is deactivated
export function deactivate() {
    return extension.deactivate();
}
