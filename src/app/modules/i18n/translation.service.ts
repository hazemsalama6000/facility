// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { LangName } from './Enums/LangNames';
import { ICurrentLangInfo } from './Interfaces/ICurrentLangInfo';

export interface Locale {
  lang: string;
  data: any;
}


const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  // Private properties
   private langIds: any = [];
   CurrentLangInfo:ICurrentLangInfo={Currentlang:'',CurrentLangImage:''};
   subject = new Subject<string>(); // a subject to notify
   myObservable = this.subject.asObservable();


  constructor(private translate: TranslateService) {
    // add new langIds to the list
    this.translate.addLangs(['en']);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('ar');
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);
      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
    this.translate.use(this.getSelectedLanguage());
  }

changeLang(lang:'ar'|'en'){
	this.setLanguage(lang);
}

getCurrentLangInfo(){
	let lang:string = this.getSelectedLanguage();	
	this.CurrentLangInfo.Currentlang = lang =='ar' ? LangName["ar"] as string:LangName["en"] as string;
	this.CurrentLangInfo.CurrentLangImage = lang =='ar'?'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg':'https://cdn-icons-png.flaticon.com/512/197/197374.png';
	return {Currentlang:this.CurrentLangInfo.Currentlang , CurrentLangImage:this.CurrentLangInfo.CurrentLangImage}
}

getHtmlDirection(){
	let lang:string = this.getSelectedLanguage();	
	let Dir = lang =='ar' ? 'rtl':'ltr';
	this.subject.next(Dir);
	return Dir;
}

  setLanguage(lang: string) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
	  let Dir = lang =='ar' ? 'rtl':'ltr';
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
