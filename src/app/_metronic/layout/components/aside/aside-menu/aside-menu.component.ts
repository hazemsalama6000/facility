import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { IUserData } from 'src/app/modules/auth/models/IUserData.interface';
import { ITreeMenu } from 'src/app/modules/permissions/models/ITreeMenu.interface';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  menu: ITreeMenu[];
  userData: IUserData;
  private unsubcribe: Subscription[] = [];
  constructor(private authService: AuthService) {
    let getdata = authService.userData.subscribe(res => {
      this.userData = res
      if (res.menu !== null)
        this.menu = res.menu[0]?.childNode ?? []
    });
    this.unsubcribe.push(getdata);
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.unsubcribe.forEach((sb) => sb.unsubscribe());
  }

}