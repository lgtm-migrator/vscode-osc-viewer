import * as vscode from 'vscode';
import { ExplorerNode, ExplorerFolderNode, Profile } from '../../node';
import { FiltersFolderNode } from '../node.filterfolder';
import { ResourceNode } from '../../resources/node.resources';
import { deleteClientGateway, getClientGateways } from '../../../cloud/clientgateways';
import { FiltersClientGateway, FiltersClientGatewayFromJSON } from 'outscale-api';

export const CLIENTGATEWAYS_FOLDER_NAME = "Client Gateways";
export class ClientGatewaysFolderNode extends FiltersFolderNode<FiltersClientGateway> implements ExplorerFolderNode {
    constructor(readonly profile: Profile) {
        super(profile, CLIENTGATEWAYS_FOLDER_NAME);
    }

    getChildren(): Thenable<ExplorerNode[]> {
        this.updateFilters();
        return getClientGateways(this.profile, this.filters).then(results => {
            if (typeof results === "string") {
                vscode.window.showErrorMessage(`Error while reading ${this.folderName}: ${results}`);
                return Promise.resolve([]);
            }
            const resources = [];
            for (const item of results) {

                if (typeof item.clientGatewayId === 'undefined') {

                    continue;
                }

                resources.push(new ResourceNode(this.profile, "", item.clientGatewayId, "ClientGateway", deleteClientGateway));

            }
            return Promise.resolve(resources);
        });

    }

    filtersFromJson(json: string): FiltersClientGateway {
        return FiltersClientGatewayFromJSON(json);
    }
}