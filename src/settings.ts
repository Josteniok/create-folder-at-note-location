import { App, PluginSettingTab, Setting } from "obsidian";
import CreateFolderAtNoteLocation from "./main";
import { FileSuggest } from "./suggesters/FileSuggester";

export interface CreateFolderAtNoteLocationSettings {
	folderFileTemplatePath: string;
}

export const DEFAULT_SETTINGS: CreateFolderAtNoteLocationSettings = {
	folderFileTemplatePath: "default",
};

export class CreateFolderAtNoteLocationSettingsTab extends PluginSettingTab {
	plugin: CreateFolderAtNoteLocation;

	constructor(app: App, plugin: CreateFolderAtNoteLocation) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Folder file template")
			.setDesc("Template file to use in newly created folders")
			.addSearch((cb) => {
				new FileSuggest(this.app, cb.inputEl);
				cb.setPlaceholder("Enter filename")
					.onChange(async (value) => {
						this.plugin.settings.folderFileTemplatePath = value;
						await this.plugin.saveSettings();
					})
					.setValue(this.plugin.settings.folderFileTemplatePath);
			});
	}
}
