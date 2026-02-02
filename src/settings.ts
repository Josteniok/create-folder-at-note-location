import { App, PluginSettingTab, Setting } from "obsidian";
import CreateFolderAtNoteLocation from "./main";

export interface CreateFolderAtNoteLocationSettings {
	createFileInFolderSetting: boolean;
}

export const DEFAULT_SETTINGS: CreateFolderAtNoteLocationSettings = {
	createFileInFolderSetting: true,
};

export class FolderAtNoteLocationPluginSettingsTab extends PluginSettingTab {
	plugin: CreateFolderAtNoteLocation;

	constructor(app: App, plugin: CreateFolderAtNoteLocation) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(
				"Create file in folder automatically when folder is created",
			)
			.setDesc(
				"Automatically create a file with the same name in the folder where the note is located.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.createFileInFolderSetting)
					.onChange(async (value) => {
						this.plugin.settings.createFileInFolderSetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
