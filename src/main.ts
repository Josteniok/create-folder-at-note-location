import { App, Modal, Setting, Notice, Plugin } from "obsidian";

export default class CreateFolderAtNoteLocation extends Plugin {
	async onload() {
		// This adds a folder where the currently open note is located
		this.addCommand({
			id: "add-folder-where-open-note-is",
			name: "Add folder here",
			callback: () => {
				const filePath = this.app.workspace.getActiveFile()?.path;

				if (filePath) {
					new GetFolderName(this.app, (result) => {
						const folderPath =
							filePath.substring(0, filePath.lastIndexOf("/")) +
							"/" +
							result;
						this.app.vault.createFolder(folderPath).then(
							(value) => {
								// Do nothing
							},
							(error) => {
								new Notice(
									"Folder not created. Folder already exists.",
								);
							},
						);
					}).open();
				}
			},
		});
	}

	onunload() {}
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

		new Setting(this.contentEl).setName("Name").addText((text) =>
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
