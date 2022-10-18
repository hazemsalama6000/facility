import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { TranslationService } from 'src/app/modules/i18n';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { LayoutService } from '../../core/layout.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  // @HostBinding('class')
  // class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  // @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  TOKENIN_LOCALSTORAGE = "token";
  userdata: IUserData;

  Currentlang: string;
  CurrentLangImage: string;
  url: string = localStorage.getItem('companyLink') as string;
  language: LanguageFlag;
  langs = languages;
  private unsubscribe: Subscription[] = [];


  constructor(
    private layout: LayoutService,
    private router: Router,
    private auth: AuthService,
    private translationService: TranslationService,
  ) {
    auth.userData.subscribe(res => this.userdata = res)
    MenuComponent.reinitialization()
  }

  logoutLogo: boolean = false;

  ngOnInit(): void {

    this.headerLeft = this.layout.getProp('header.left') as string;
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

  changeLang = () => {
    let currentLang=this.translationService.getCurrentLangInfo()
    console.log(currentLang)
    //set language selected
    this.translationService.changeLang(currentLang.Currentlang=='English'?'ar':'en');
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
    this.setDirection();
  }

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
