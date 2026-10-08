import { type SettingDefinitionItem, App, PluginSettingTab  } from "obsidian";
import CreateFolderAtNoteLocation from "./main";

export interface CreateFolderAtNoteLocationSettings {
	folderFileTemplatePath: string;
	createFolderAnyway: boolean;
}

export const DEFAULT_SETTINGS: CreateFolderAtNoteLocationSettings = {
	folderFileTemplatePath: "",
	createFolderAnyway: true,
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
				desc: 'Template file to use in newly created folders.',
				control: {
					type: 'file',
					key: 'folderFileTemplatePath',
					placeholder: 'Enter filename'
				}
			},
			{
				name: 'Create folder even when a note is not active',
				desc: 'Creates the folder at the root if no note is active.',
				control: {
					type: 'toggle',
					key: 'createFolderAnyway'
				}
			}
		]
	}
}
