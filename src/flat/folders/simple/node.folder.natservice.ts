import * as vscode from 'vscode';
import { ExplorerNode, ExplorerFolderNode, Profile } from '../../node';
import { FiltersFolderNode } from '../node.filterfolder';
import { ResourceNode } from '../../resources/node.resources';
import { deleteNatService, getNatServices } from '../../../cloud/natservices';
import { FiltersNatService, FiltersNatServiceFromJSON } from 'outscale-api';

export const NATSERVICES_FOLDER_NAME = "Nat Services";
export class NatServicesFolderNode extends FiltersFolderNode<FiltersNatService> implements ExplorerFolderNode {
    constructor(readonly profile: Profile) {
        super(profile, NATSERVICES_FOLDER_NAME);
    }

    getChildren(): Thenable<ExplorerNode[]> {
        this.updateFilters();
        return getNatServices(this.profile, this.filters).then(results => {
            if (typeof results === "string") {
                vscode.window.showErrorMessage(`Error while reading ${this.folderName}: ${results}`);
                return Promise.resolve([]);
            }
            const resources = [];
            for (const item of results) {

                if (typeof item.natServiceId === 'undefined') {

                    continue;
                }

                resources.push(new ResourceNode(this.profile, "", item.natServiceId, "NatService", deleteNatService));

            }
            return Promise.resolve(resources);
        });

    }

    filtersFromJson(json: string): FiltersNatService {
        return FiltersNatServiceFromJSON(json);
    }
}