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

  userData: IUserData;
  private unsubcribe: Subscription[] = [];
  constructor(private authService: AuthService) {
    let getdata = authService.userData.subscribe(res => this.userData = res);
    this.unsubcribe.push(getdata);
  }

  ngOnInit(): void { console.log(this.userData.menu) }

  ngOnDestroy() {
    this.unsubcribe.forEach((sb) => sb.unsubscribe());
  }


  menu: ITreeMenu[] = [
    {
      "id": 1,
      "name": "Screen",
      "isLast": false,
      "route": "",
      "permission": "",
      "isDeleted": false,
      "icon": "",
      "childNode": [
        {
          "id": 30,
          "name": "الرئيسية",
          "parentId": 1,
          "isLast": true,
          "route": "/",
          "permission": "Screen.Bills.Issues.View",
          "isDeleted": false,
          "icon": "home",
          "childNode": []
        },
        {
          "id": 31,
          "name": "صلاحيات المدير العام",
          "parentId": 1,
          "isLast": false,
          "route": "",
          "permission": "",
          "isDeleted": false,
          "icon": "",
          "childNode": [
            {
              "id": 32,
              "name": "إعدادات",
              "parentId": 31,
              "isLast": false,
              "icon": "manage_accounts", "isDeleted": false,
              "childNode": [
                {
                  "id": 34,
                  "name": "الشركات",
                  "parentId": 32,
                  "isLast": true,
                  "route": "/hr/company", "isDeleted": false,
                  "permission": "Screen.Shared.Company.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 35,
                  "name": "صلاحيات المدير",
                  "parentId": 32,
                  "isLast": true, "isDeleted": false,
                  "route": "/permissions/superadminroles",
                  "permission": "Screen.Shared.Geographic.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 36,
                  "name": "المستخدمين المتصلين",
                  "parentId": 32,
                  "isLast": true, "isDeleted": false,
                  "route": "/permissions/onlineUsers",
                  "permission": "Screen.Shared.Company.View",
                  "icon": "",
                  "childNode": []
                }
              ]
            },
            {
              "id": 33,
              "name": "متابعة المستخدمين",
              "parentId": 31,
              "isLast": false,
              "route": "",
              "permission": "", "isDeleted": false,
              "icon": "people_outline",
              "childNode": [
                {
                  "id": 37,
                  "name": "بيانات الدخول للمستخدمين ",
                  "parentId": 33,
                  "isLast": true, "isDeleted": false,
                  "route": "/permissions/userconnectionlog",
                  "permission": "Screen.Shared.Company.View",
                  "icon": "",
                  "childNode": []
                }
              ]
            }
          ]
        },
        {
          "id": 39,
          "name": "شئون العاملين",
          "parentId": 1,
          "isLast": false,
          "route": "",
          "permission": "",
           "isDeleted": false,
          "icon": "",
          "childNode": [
            {
              "id": 41,
              "name": "الوظائف",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/hr/jobs",
              "permission": "Screen.Shared.Company.View",
              "icon": "job",
              "childNode": []
            }, {
              "id": 41,
              "name": " بيانات الموظف ",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/employee/employeeprofile",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }, {
              "id": 41,
              "name": " قائمة الموظفين ",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/employee/employeelist",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }
          ]
        }, 
        {
          "id": 388,
          "name": "اعدادات عامة",
          "parentId": 1,
          "isLast": false,
          "route": "",
          "permission": "", 
          "isDeleted": false,
          "icon": "",
          "childNode": [
            {
              "id": 41,
              "name": "المحافظات والمناطق",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/share/state_region",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            } , {
              "id": 42,
              "name": "الادارات والاقسام",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/share/department_section",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            } , {
              "id": 41,
              "name": "خطوط السير",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "declarations/pathroute",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }, {
              "id": 41,
              "name": "تعريف الفترة المالية",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "declarations/financialyear",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }
          ]
        },
        {
          "id": 42,
          "name": "إعدادات السيارات",
          "parentId": 1,
          "isLast": false, "isDeleted": false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 41,
              "name": "تعريف السيارات",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/car/managecar",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            } 
          ]
        },{
          "id": 42,
          "name": "إعدادات المخازن",
          "parentId": 1,
          "isLast": false, 
          "isDeleted": false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [  {
              "id": 41,
              "name": "المخازن",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/declarations/inventory",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            },
            {
              "id": 41,
              "name": "التقسيم الداخلى للمخازن",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/declarations/internaldivision",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }  ,
            {
              "id": 41,
              "name": "تصنيف المخازن",
              "parentId": 39,
              "isLast": true,
              "isDeleted": false,
              "route": "/declarations/invcategory",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            } 
          ]
        },
        {
          "id": 44,
          "name": "الفواتير",
          "parentId": 1,
          "isLast": false, "isDeleted": false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": []
        }
        
        ,
        {
          "id": 55,
          "name": "إدارة المستخدمين",
          "parentId": 1,
          "isLast": false, "isDeleted": false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 56,
              "name": "صلاحيات المستخدمين",
              "parentId": 55,
              "isLast": false, "isDeleted": false,
              "route": "",
              "permission": "",
              "icon": "admin_panel_settings",
              "childNode": [
                {
                  "id": 57,
                  "name": "المستخدمين ",
                  "parentId": 56,
                  "isLast": true, "isDeleted": false,
                  "route": "/permissions/users",
                  "permission": "Screen.Customer.Customers.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 58,
                  "name": "الأدوار",
                  "parentId": 56,
                  "isLast": true, "isDeleted": false,
                  "route": "/permissions/roles",
                  "permission": "Screen.Technician.Technician.View",
                  "icon": "",
                  "childNode": []
                }
              ]
            }
          ]
        }
      ]
    }
  ];


}