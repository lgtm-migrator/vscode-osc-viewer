
import * as osc from "outscale-api";
import { FiltersDirectLink } from "outscale-api";
import { getConfig, handleRejection } from '../cloud/cloud';
import { Profile } from "../flat/node";


// Retrieve all items of the resource DirectLink
export function getDirectLinks(profile: Profile, filters?: FiltersDirectLink): Promise<Array<osc.DirectLink> | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadDirectLinksOperationRequest = {
        readDirectLinksRequest: {
            filters: filters
        }
    };

    const api = new osc.DirectLinkApi(config);
    return api.readDirectLinks(readParameters)
        .then((res: osc.ReadDirectLinksResponse) => {
            if (res.directLinks === undefined || res.directLinks.length === 0) {
                return [];
            }
            return res.directLinks;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Retrieve a specific item of the resource DirectLink
export function getDirectLink(profile: Profile, resourceId: string): Promise<osc.DirectLink | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadDirectLinksOperationRequest = {
        readDirectLinksRequest: {
            filters: {
                directLinkIds: [resourceId]
            }
        }
    };

    const api = new osc.DirectLinkApi(config);
    return api.readDirectLinks(readParameters)
        .then((res: osc.ReadDirectLinksResponse) => {
            if (res.directLinks === undefined || res.directLinks.length === 0) {
                return {};
            }
            return res.directLinks[0];
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Delete a specific item the resource DirectLink
export function deleteDirectLink(profile: Profile, resourceId: string): Promise<string | undefined> {
    const config = getConfig(profile);
    const deleteParameters: osc.DeleteDirectLinkOperationRequest = {
        deleteDirectLinkRequest: {
            directLinkId: resourceId
        }
    };

    const api = new osc.DirectLinkApi(config);
    return api.deleteDirectLink(deleteParameters)
        .then(() => {
            return undefined;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}