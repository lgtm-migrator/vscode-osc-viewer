import * as vscode from 'vscode';

import { AccessKeyToJSON, AccountToJSON, ApiAccessRuleToJSON, CaToJSON, ClientGatewayToJSON, DhcpOptionsSetToJSON, DirectLinkInterfaceToJSON, DirectLinkToJSON, FlexibleGpuToJSON, ImageToJSON, InternetServiceToJSON, KeypairToJSON, LoadBalancerToJSON, NatServiceToJSON, NetAccessPointToJSON, NetPeeringToJSON, NetToJSON, NicToJSON, PublicIpToJSON, RouteTableToJSON, SecurityGroupToJSON, SnapshotToJSON, SubnetToJSON, VirtualGatewayToJSON, VmToJSON, VolumeToJSON, VpnConnectionToJSON } from "outscale-api";
import { getExternalIP } from "../cloud/publicips";
import { getKeypair } from "../cloud/keypairs";
import { getLoadBalancer } from "../cloud/loadbalancers";
import { getOMI } from "../cloud/images";
import { getRouteTable } from "../cloud/routetables";
import { getSecurityGroup } from "../cloud/securitygroups";
import { getSnapshot } from "../cloud/snapshots";
import { getVm } from "../cloud/vms";
import { getVolume } from "../cloud/volumes";
import { getNet } from "../cloud/nets";
import { getProfile } from "../config_file/utils";
import { Profile } from "../flat/node";
import { getAccount } from '../cloud/account';
import { getAccessKey } from '../cloud/accesskeys';
import { getApiAccessRule } from '../cloud/apiaccessrules';
import { getCa } from '../cloud/cas';
import { getClientGateway } from '../cloud/clientgateways';
import { getDhcpOption } from '../cloud/dhcpoptions';
import { getDirectLinkInterface } from '../cloud/directlinkinterfaces';
import { getDirectLink } from '../cloud/directlinks';
import { getFlexibleGpu } from '../cloud/flexiblegpus';
import { getInternetService } from '../cloud/internetservices';
import { getNatService } from '../cloud/natservices';
import { getNetAccessPoint } from '../cloud/netaccesspoints';
import { getNetPeering } from '../cloud/netpeerings';
import { getNic } from '../cloud/nics';
import { getSubnet } from '../cloud/subnets';
import { getVirtualGateway } from '../cloud/virtualgateways';
import { getVpnConnection } from '../cloud/vpnconnections';


class ResourceEncoding {
    constructor(
        public get: (profile: Profile, resourceId: string) => any,
        public toString: (resourceData: any) => string,
    ) { }
}

const resourceMap = new Map([
    ["profile", new ResourceEncoding(getAccount, AccountToJSON)],
    ["vms", new ResourceEncoding(getVm, VmToJSON)],
    ["vpc", new ResourceEncoding(getNet, NetToJSON)],
    ["securitygroups", new ResourceEncoding(getSecurityGroup, SecurityGroupToJSON)],
    ["keypairs", new ResourceEncoding(getKeypair, KeypairToJSON)],
    ["volumes", new ResourceEncoding(getVolume, VolumeToJSON)],
    ["loadbalancers", new ResourceEncoding(getLoadBalancer, LoadBalancerToJSON)],
    ["eips", new ResourceEncoding(getExternalIP, PublicIpToJSON)],
    ["omis", new ResourceEncoding(getOMI, ImageToJSON)],
    ["snapshots", new ResourceEncoding(getSnapshot, SnapshotToJSON)],
    ["routetables", new ResourceEncoding(getRouteTable, RouteTableToJSON)],
    ["AccessKey", new ResourceEncoding(getAccessKey, AccessKeyToJSON)],
    ["ApiAccessRule", new ResourceEncoding(getApiAccessRule, ApiAccessRuleToJSON)],
    ["Ca", new ResourceEncoding(getCa, CaToJSON)],
    ["ClientGateway", new ResourceEncoding(getClientGateway, ClientGatewayToJSON)],
    ["DhcpOption", new ResourceEncoding(getDhcpOption, DhcpOptionsSetToJSON)],
    ["DirectLink", new ResourceEncoding(getDirectLink, DirectLinkToJSON)],
    ["DirectLinkInterface", new ResourceEncoding(getDirectLinkInterface, DirectLinkInterfaceToJSON)],
    ["FlexibleGpu", new ResourceEncoding(getFlexibleGpu, FlexibleGpuToJSON)],
    ["InternetService", new ResourceEncoding(getInternetService, InternetServiceToJSON)],
    ["NatService", new ResourceEncoding(getNatService, NatServiceToJSON)],
    ["NetAccessPoint", new ResourceEncoding(getNetAccessPoint, NetAccessPointToJSON)],
    ["NetPeering", new ResourceEncoding(getNetPeering, NetPeeringToJSON)],
    ["Nic", new ResourceEncoding(getNic, NicToJSON)],
    ["Subnet", new ResourceEncoding(getSubnet, SubnetToJSON)],
    ["VirtualGateway", new ResourceEncoding(getVirtualGateway, VirtualGatewayToJSON)],
    ["VpnConnection", new ResourceEncoding(getVpnConnection, VpnConnectionToJSON)],
]);

export class OscVirtualContentProvider implements vscode.TextDocumentContentProvider {
    public onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this.onDidChangeEmitter.event;

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        const pathSplit = uri.path.split("/");
        if (pathSplit.length !== 4) {
            throw new Error("malformed uri");
        }

        // Retrieve Profile
        const uriProfile = pathSplit[1];
        const profile = getProfile(uriProfile);

        // Retrieve the resource Type
        const resourceType = pathSplit[2];
        const resourceId = pathSplit[3];
        return this.readFileAsync(profile, resourceType, resourceId);

    }

    async readFileAsync(profile: Profile, resourceType: string, resourceId: string): Promise<string> {
        const resourceEncoding = resourceMap.get(resourceType);
        if (typeof resourceEncoding === 'undefined') {
            throw new Error(`Unable to display resource ${resourceId}: the resource is not implemented.`);
        }
        const res = await resourceEncoding.get(profile, resourceId);
        if (typeof res === "string") {
            throw new Error(`Unable to display resource ${resourceId}: ${res}`);
        }
        return JSON.stringify(resourceEncoding.toString(res), null, 4);
    }
}