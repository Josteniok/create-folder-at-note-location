import { type SettingDefinitionItem, App, PluginSettingTab  } from "obsidian";
import CreateFolderAtNoteLocation from "./main";

export interface CreateFolderAtNoteLocationSettings {
	folderFileTemplatePath: string;
}

export const DEFAULT_SETTINGS: CreateFolderAtNoteLocationSettings = {
	folderFileTemplatePath: "",
};

export class CreateFolderAtNoteLocationSettingsTab extends PluginSettingTab {
	plugin: CreateFolderAtNoteLocation;

	constructor(app: App, plugin: CreateFolderAtNoteLocation) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: 'Folder file template',
				desc: 'Template file to use in newly created folders',
				control: {
					type: 'file',
					key: 'folderFileTemplatePath',
					placeholder: 'Enter filename'
				}
			}
		]
	}
}
