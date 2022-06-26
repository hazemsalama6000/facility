import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService } from '../../../../../../modules/auth';
import { Router } from '@angular/router';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  TOKENIN_LOCALSTORAGE = "token";

  Currentlang: string;
  CurrentLangImage: string;

  language: LanguageFlag;
  userdata: IUserData;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  constructor(private auth: AuthService, private translationService: TranslationService, private router: Router) {
    auth.getUserByToken1().subscribe(res => this.userdata = res);

  }

  ngOnInit(): void {
    //get language that selected
    let CurrentLangInfoObject = this.translationService.getCurrentLangInfo();
    this.Currentlang = CurrentLangInfoObject.Currentlang;
    this.CurrentLangImage = CurrentLangInfoObject.CurrentLangImage;
    this.language = {
      name: this.Currentlang,
      flag: this.CurrentLangImage,
      lang: this.Currentlang == 'English' ? 'en' : 'ar',
      active: true
    };
  }

  logout() {

    localStorage.removeItem(this.TOKENIN_LOCALSTORAGE);
    this.router.navigate(['/auth']);

  }

  setDirection = () => {
    this.translationService.getHtmlDirection();
  }

  changeLang = (lang: 'ar' | 'en') => {
    //set language selected
    this.translationService.changeLang(lang);
    //get language that selected
    let CurrentLangInfoObject = this.translationService.getCurrentLangInfo();
    this.Currentlang = CurrentLangInfoObject.Currentlang;
    this.CurrentLangImage = CurrentLangInfoObject.CurrentLangImage;
    this.setDirection();
  }
  // selectLanguage(lang: string) {
  //   this.translationService.setLanguage(lang);
  //   this.setLanguage(lang);
  //   // document.location.reload();
  // }

  // setLanguage(lang: string) {
  //   this.langs.forEach((language: LanguageFlag) => {
  //     if (language.lang === lang) {
  //       language.active = true;
  //       this.language = language;
  //     } else {
  //       language.active = false;
  //     }
  //   });
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: 'ar' | 'en';
  name: string;
  flag: string;
  active?: boolean;
}

const languages: LanguageFlag[] = [
  {
    lang: 'en',
    name: 'English',
    flag: 'https://cdn-icons-png.flaticon.com/512/197/197374.png',
  },
  {
    lang: 'ar',
    name: 'عربى',
    flag: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Flag_of_Saudi_Arabia.svg',
  }
];
