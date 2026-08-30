import { App, Modal, Notice, Plugin, Setting, TFile } from "obsidian";
import {
	CreateFolderAtNoteLocationSettings,
	CreateFolderAtNoteLocationSettingsTab,
	DEFAULT_SETTINGS,
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
				const filePath = this.app.workspace.getActiveFile()?.path;

				if (filePath) {
					new GetFolderName(
						this.app,
						(result) => {
							const folderPath =
								filePath.substring(
									0,
									filePath.lastIndexOf("/"),
								) +
								"/" +
								result;
							this.app.vault.createFolder(folderPath).then(
								() => {},
								(error) => {
									new Notice(
										"Folder not created. Folder already exists.",
									);
								},
							);
						},
						"Enter folder name",
						"Folder name",
					).open();
				} else {
					new Notice("Folder not created. No active note found.");
				}
			},
		});

		// This adds a folder where the currently open note is located
		// and also a note in the folder with the same name as the folder,
		// which is useful for the Waypoints plugin.
		this.addCommand({
			id: "add-folder-with-note-where-open-note-is",
			name: "Add folder with note here",
			callback: () => {
				const filePath = this.app.workspace.getActiveFile()?.path;

				const templateFile = this.app.vault.getAbstractFileByPath(
					this.settings.folderFileTemplatePath,
				);

				if (filePath) {
					new GetFolderName(
						this.app,
						(result) => {
							const folderPath =
								filePath.substring(
									0,
									filePath.lastIndexOf("/"),
								) +
								"/" +
								result;
							this.app.vault.createFolder(folderPath).then(
								(value) => {
									if (
										templateFile &&
										templateFile instanceof TFile
									) {
										this.app.vault
											.read(templateFile)
											.then(
												(readFile) => {
													this.app.vault
														.create(
															folderPath +
																"/" +
																result +
																".md",
															readFile,
														)
														.then(
															(value) => {
																void this.app.workspace
																	.getLeaf(true)
																	.openFile(value);
															},
															(error) => {
																new Notice(
																	"File not copied. File already exists.",
																);
															},
														);
												},
												(error) => {
													new Notice(
														"File not read. File does not exist.",
													);
											});
									} else {
										this.app.vault
											.create(
												folderPath +
													"/" +
													result +
													".md",
												"",
											)
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
						},
						"Enter folder and note name",
						"Folder and note name",
					).open();
				} else {
					new Notice("Folder not created. No active note found.");
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(
			new CreateFolderAtNoteLocationSettingsTab(this.app, this),
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
}

class GetFolderName extends Modal {
	constructor(
		app: App,
		onSubmit: (folderName: string) => void,
		modalTitle: string,
		promptText: string,
	) {
		super(app);

		this.scope.register(null, "Enter", () => {
			this.close();
			if (folderName !== "") {
				onSubmit(folderName);
			}
		});

		this.setTitle(modalTitle);
		let folderName = "";

		new Setting(this.contentEl).setName(promptText).addText((text) =>
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
