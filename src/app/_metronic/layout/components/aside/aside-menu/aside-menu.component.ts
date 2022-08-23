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

  ngOnInit(): void {console.log(this.userData.menu) }

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
      "isDeleted":false,
      "icon": "",
      "childNode": [
        {
          "id": 30,
          "name": "الرئيسية",
          "parentId": 1,
          "isLast": true,
          "route": "/",
          "permission": "Screen.Bills.Issues.View",
          "isDeleted":false,
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
          "isDeleted":false,
          "icon": "",
          "childNode": [
            {
              "id": 32,
              "name": "إعدادات",
              "parentId": 31,
              "isLast": false,
              "icon": "manage_accounts","isDeleted":false,
              "childNode": [
                {
                  "id": 34,
                  "name": "الشركات",
                  "parentId": 32,
                  "isLast": true,
                  "route": "/hr/company","isDeleted":false,
                  "permission": "Screen.Shared.Company.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 35,
                  "name": "صلاحيات المدير",
                  "parentId": 32,
                  "isLast": true,"isDeleted":false,
                  "route": "/permissions/superadminroles",
                  "permission": "Screen.Shared.Geographic.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 36,
                  "name": "المستخدمين المتصلين",
                  "parentId": 32,
                  "isLast": true,"isDeleted":false,
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
              "permission": "","isDeleted":false,
              "icon": "people_outline",
              "childNode": [
                {
                  "id": 37,
                  "name": "بيانات الدخول للمستخدمين ",
                  "parentId": 33,
                  "isLast": true,"isDeleted":false,
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
          "permission": "","isDeleted":false,
          "icon": "",
          "childNode": [
            {
              "id": 41,
              "name": " بيانات الموظف ",
              "parentId": 39,
              "isLast": true,"isDeleted":false,
              "route": "/employee/employeeprofile",
              "permission": "Screen.Shared.Company.View",
              "icon": "perm_identity",
              "childNode": []
            }
          ]
        },
        {
          "id": 42,
          "name": "إعدادات العملاء",
          "parentId": 1,
          "isLast": false,"isDeleted":false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 43,
              "name": " بيانات العملاء ",
              "parentId": 42,
              "isLast": true,"isDeleted":false,
              "route": "/customer/cutomerprofile",
              "permission": "Screen.Customer.Customers.View",
              "icon": "supervisor_account",
              "childNode": []
            }
          ]
        },
        {
          "id": 44,
          "name": "الفواتير",
          "parentId": 1,
          "isLast": false,"isDeleted":false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 45,
              "name": "الفواتير",
              "parentId": 44,
              "isLast": false,"isDeleted":false,
              "route": "",
              "permission": "",
              "icon": "receipt_long",
              "childNode": [
                {
                  "id": 46,
                  "name": " فواتير العملاء ",
                  "parentId": 45,
                  "isLast": true,"isDeleted":false,
                  "route": "/operation/customerbills",
                  "permission": "Screen.Shared.Company.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 47,
                  "name": " الأصدارات ",
                  "parentId": 45,
                  "isLast": true,"isDeleted":false,
                  "route": "/operation/issue",
                  "permission": "Screen.Technician.Technician.View",
                  "icon": "",
                  "childNode": []
                }
              ]
            }
          ]
        },
        {
          "id": 48,
          "name": "العمليات",
          "parentId": 1,
          "isLast": false,"isDeleted":false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 49,
              "name": "الشكاوى",
              "parentId": 48,
              "isLast": false,"isDeleted":false,
              "route": "",
              "permission": "",
              "icon": "support_agent",
              "childNode": [
                {
                  "id": 50,
                  "name": " انواع الشكاوى ",
                  "parentId": 49,
                  "isLast": true,"isDeleted":false,
                  "route": "/operation/compainType",
                  "permission": "Screen.Customer.Customers.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 51,
                  "name": " الشكاوى ",
                  "parentId": 49,
                  "isLast": true,"isDeleted":false,
                  "route": "/operation/complainlist",
                  "permission": "Screen.Operation.Complaints.View",
                  "icon": "",
                  "childNode": []
                }
              ]
            },
            {
              "id": 52,
              "name": " القراءات ",
              "parentId": 48,
              "isLast": true,"isDeleted":false,
              "route": "/operation/readinglist",
              "permission": "Screen.Operation.MeterReading.View",
              "icon": "checklist",
              "childNode": []
            },
            {
              "id": 53,
              "name": " سحب البيانات ",
              "parentId": 48,
              "isLast": true,"isDeleted":false,
              "route": "/operation/receivedata",
              "permission": "Screen.Technician.Technician.View",
              "icon": "download",
              "childNode": []
            },
            {
              "id": 54,
              "name": " ادارة تعديلات العملاء ",
              "parentId": 48,
              "isLast": true,"isDeleted":false,
              "route": "/operation/cutomerupdatemanage",
              "permission": "Screen.Customer.Customers.View",
              "icon": "manage_accounts",
              "childNode": []
            }
          ]
        },
        {
          "id": 55,
          "name": "إدارة المستخدمين",
          "parentId": 1,
          "isLast": false,"isDeleted":false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 56,
              "name": "صلاحيات المستخدمين",
              "parentId": 55,
              "isLast": false,"isDeleted":false,
              "route": "",
              "permission": "",
              "icon": "admin_panel_settings",
              "childNode": [
                {
                  "id": 57,
                  "name": "المستخدمين ",
                  "parentId": 56,
                  "isLast": true,"isDeleted":false,
                  "route": "/permissions/users",
                  "permission": "Screen.Customer.Customers.View",
                  "icon": "",
                  "childNode": []
                },
                {
                  "id": 58,
                  "name": "الأدوار",
                  "parentId": 56,
                  "isLast": true,"isDeleted":false,
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
    },
    {
      "id": 6,
      "name": "Report",
      "isLast": false,"isDeleted":false,
      "route": "",
      "permission": "",
      "icon": "",
      "childNode": [
        {
          "id": 10,
          "name": "Child_L3-1",
          "parentId": 6,
          "isLast": false,"isDeleted":false,
          "route": "",
          "permission": "",
          "icon": "",
          "childNode": [
            {
              "id": 13,
              "name": "Child_L6_2",
              "parentId": 10,
              "isLast": false,"isDeleted":false,
              "route": "",
              "permission": "",
              "icon": "",
              "childNode": [
                {
                  "id": 14,
                  "name": "Child_L6_3",
                  "parentId": 13,
                  "isLast": true,"isDeleted":false,
                  "route": "Module/Test",
                  "permission": "Screen.Technician.Technician.View",
                  "icon": "Icon",
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