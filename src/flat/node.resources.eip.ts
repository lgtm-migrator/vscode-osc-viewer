import { ThemeIcon } from 'vscode';
import { Profile } from './node';
import { ResourceNode } from './node.resources';


export class PublicIpResourceNode extends ResourceNode {

    constructor(readonly profile: Profile, readonly resourceName: string, readonly resourceId: string, readonly resourceState:string) {
		super(profile, resourceName, resourceId, "eips");
    }

	getContextValue(): string {
		return "eipresourcenode";
	}

	getIconPath(): ThemeIcon {
		switch (this.resourceState) {
			case "link":
				return new ThemeIcon("plug");
			default:
				return new ThemeIcon("dash");
		}
		
	}

}