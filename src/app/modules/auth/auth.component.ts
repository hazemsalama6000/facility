import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from '../i18n';

@Component({
  selector: '<body[root]>',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  Currentlang:string;
  CurrentLangImage:string;

  constructor(private TranslationService:TranslationService) {}

  setDirection=()=>
  {
	  this.TranslationService.getHtmlDirection();
  }

  changeLang = (lang:'ar'|'en')=>
  {
	  //set language selected
    this.TranslationService.changeLang(lang);
      //get language that selected
	let CurrentLangInfoObject = this.TranslationService.getCurrentLangInfo();
    this.Currentlang=CurrentLangInfoObject.Currentlang;
	this.CurrentLangImage=CurrentLangInfoObject.CurrentLangImage; 
	this.setDirection();
  }

  ngOnInit(): void {
    document.body.classList.add('bg-white');
    
	//get language that selected
	let CurrentLangInfoObject = this.TranslationService.getCurrentLangInfo();
    this.Currentlang=CurrentLangInfoObject.Currentlang;
	this.CurrentLangImage=CurrentLangInfoObject.CurrentLangImage; 
 }

  ngOnDestroy() {
    document.body.classList.remove('bg-white');
  }
}
