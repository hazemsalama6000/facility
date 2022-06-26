import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as arLang } from './modules/i18n/vocabs/ar';
import { DOCUMENT } from '@angular/common';
@Component({
	// tslint:disable-next-line:component-selector
	selector: 'body[root]',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	popoverTitle = 'Popover title';
	popoverMessage = 'Popover description';
	confirmClicked = false;
	cancelClicked = false;

	direction: string;

	constructor(private translationService: TranslationService
		, @Inject(DOCUMENT) private document: Document) {
		// register translations
		this.translationService.loadTranslations(
			enLang,
			arLang
		);

	}

	setDirection() {
		this.translationService.myObservable.subscribe(
			(data) => {
				this.direction = data;
				document.dir = this.direction;
				this.direction == 'rtl' ? this.loadStyle('rtlStyleSheet.css') : ''
			}
		);
	}


	ngOnInit() {
		this.setDirection();
		this.direction = this.translationService.getHtmlDirection();
		this.direction == 'rtl' ? this.loadStyle('rtlStyleSheet.css') : ''
	}


	DoNotloadStyle(styleName: string) {
		this.document.removeChild
		const head = this.document.getElementsByTagName('head')[0];

		let themeLink = this.document.getElementById(
			'client-theme'
		) as HTMLLinkElement;

		if (themeLink) {
			themeLink.href = styleName;
		}
		else {
			const style = this.document.createElement('link');
			style.id = 'client-theme';
			style.rel = 'stylesheet';
			style.href = `${styleName}`;

			head.appendChild(style);
		}
	}



	loadStyle(styleName: string) {
		const head = this.document.getElementsByTagName('head')[0];

		let themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;

		if (themeLink) {
			themeLink.href = styleName;
		}
		else {
			const style = this.document.createElement('link');
			style.id = 'client-theme';
			style.rel = 'stylesheet';
			style.href = `${styleName}`;

			head.appendChild(style);
		}
	}



}
