
import * as osc from "outscale-api";
import { FiltersVpnConnection } from "outscale-api";
import { getConfig, handleRejection } from '../cloud/cloud';
import { Profile } from "../flat/node";


// Retrieve all items of the resource VpnConnection
export function getVpnConnections(profile: Profile, filters?: FiltersVpnConnection): Promise<Array<osc.VpnConnection> | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadVpnConnectionsOperationRequest = {
        readVpnConnectionsRequest: {
            filters: filters
        }
    };

    const api = new osc.VpnConnectionApi(config);
    return api.readVpnConnections(readParameters)
        .then((res: osc.ReadVpnConnectionsResponse) => {
            if (res.vpnConnections === undefined || res.vpnConnections.length === 0) {
                return [];
            }
            return res.vpnConnections;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Retrieve a specific item of the resource VpnConnection
export function getVpnConnection(profile: Profile, resourceId: string): Promise<osc.VpnConnection | string> {
    const config = getConfig(profile);
    const readParameters: osc.ReadVpnConnectionsOperationRequest = {
        readVpnConnectionsRequest: {
            filters: {
                vpnConnectionIds: [resourceId]
            }
        }
    };

    const api = new osc.VpnConnectionApi(config);
    return api.readVpnConnections(readParameters)
        .then((res: osc.ReadVpnConnectionsResponse) => {
            if (res.vpnConnections === undefined || res.vpnConnections.length === 0) {
                return {};
            }
            return res.vpnConnections[0];
        }, (err_: any) => {
            return handleRejection(err_);
        });
}

// Delete a specific item the resource VpnConnection
export function deleteVpnConnection(profile: Profile, resourceId: string): Promise<string | undefined> {
    const config = getConfig(profile);
    const deleteParameters: osc.DeleteVpnConnectionOperationRequest = {
        deleteVpnConnectionRequest: {
            vpnConnectionId: resourceId
        }
    };

    const api = new osc.VpnConnectionApi(config);
    return api.deleteVpnConnection(deleteParameters)
        .then(() => {
            return undefined;
        }, (err_: any) => {
            return handleRejection(err_);
        });
}