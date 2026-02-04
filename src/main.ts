import { App, Modal, Setting, Notice, Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	CreateFolderAtNoteLocationSettings,
	FolderAtNoteLocationPluginSettingsTab,
} from "./settings";

export default class CreateFolderAtNoteLocation extends Plugin {
	settings: CreateFolderAtNoteLocationSettings;

	async onload() {
		await this.loadSettings();

		// This adds a folder where the currently open note is located
		this.addCommand({
			id: "add-folder-where-open-note-is",
			name: "Add folder here",
			callback: () => {
				this.addFolder();
			},
		});

		this.addSettingTab(
			new FolderAtNoteLocationPluginSettingsTab(this.app, this),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<CreateFolderAtNoteLocationSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	addFolder() {
		const filePath = this.app.workspace.getActiveFile()?.path;

		if (filePath) {
			new GetFolderName(this.app, (result) => {
				const folderPath =
					filePath.substring(0, filePath.lastIndexOf("/")) +
					"/" +
					result;
				this.app.vault.createFolder(folderPath).then(
					(value) => {
						if (this.settings.createFileInFolderSetting) {
							this.app.vault
								.create(folderPath + "/" + result + ".md", "")
								.then(
									(value) => {
										void this.app.workspace
											.getLeaf(true)
											.openFile(value);
									},
									(error) => {
										new Notice(
											"File not created. File already exists.",
										);
									},
								);
						}
					},
					(error) => {
						new Notice(
							"Folder not created. Folder already exists.",
						);
					},
				);
			}).open();
		} else {
			new Notice("Folder not created. No active note found.");
		}
	}
}

class GetFolderName extends Modal {
	constructor(app: App, onSubmit: (folderName: string) => void) {
		super(app);

		this.scope.register(null, "Enter", () => {
			this.close();
			if (folderName !== "") {
				onSubmit(folderName);
			}
		});

		this.setTitle("Enter folder name");
		let folderName = "";

		new Setting(this.contentEl).setName("Folder name").addText((text) =>
			text.onChange((value) => {
				folderName = value;
			}),
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
