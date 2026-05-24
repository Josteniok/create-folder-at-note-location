// Modified from FolderSuggester in the Templater plugin: https://github.com/SilentVoid13/Templater

import { AbstractInputSuggest, App, TAbstractFile, TFile } from "obsidian";

export class FileSuggest extends AbstractInputSuggest<TFile> {
	constructor(
		app: App,
		public inputEl: HTMLInputElement,
	) {
		super(app, inputEl);
	}

	getSuggestions(inputStr: string): TFile[] {
		const abstractFiles = this.app.vault.getAllLoadedFiles();
		const files: TFile[] = [];
		const lowerCaseInputStr = inputStr.toLowerCase();

		abstractFiles.forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile &&
				file.path.toLowerCase().includes(lowerCaseInputStr)
			) {
				files.push(file);
			}
		});

		return files.slice(0, 1000);
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.setValue(file.path);
		this.inputEl.trigger("input");
		this.close();
	}
}
