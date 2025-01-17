import * as vscode from 'vscode';
import { ExplorerNode, ExplorerFolderNode, Profile } from '../../node';
import { FiltersFolderNode } from '../node.filterfolder';
import { ResourceNode } from '../../resources/node.resources';
import { deleteCa, getCas } from '../../../cloud/cas';
import { FiltersCa, FiltersCaFromJSON } from 'outscale-api';

export const CA_FOLDER_NAME = "Cas";
export class CasFolderNode extends FiltersFolderNode<FiltersCa> implements ExplorerFolderNode {
    constructor(readonly profile: Profile) {
        super(profile, CA_FOLDER_NAME);
    }

    getChildren(): Thenable<ExplorerNode[]> {
        this.updateFilters();
        return getCas(this.profile, this.filters).then(results => {
            if (typeof results === "string") {
                vscode.window.showErrorMessage(`Error while reading ${this.folderName}: ${results}`);
                return Promise.resolve([]);
            }
            const resources = [];
            for (const item of results) {

                if (typeof item.caId === 'undefined') {

                    continue;
                }

                resources.push(new ResourceNode(this.profile, "", item.caId, "Ca", deleteCa));

            }
            return Promise.resolve(resources);
        });

    }

    filtersFromJson(json: string): FiltersCa {
        return FiltersCaFromJSON(json);
    }
}