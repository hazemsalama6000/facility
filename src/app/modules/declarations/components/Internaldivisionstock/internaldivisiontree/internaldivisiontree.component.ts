import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AddmenuComponent } from 'src/app/modules/permissions/components/managesidemenu/addmenu/addmenu.component';
import { ITreeMenu } from 'src/app/modules/permissions/models/ITreeMenu.interface';
import { MenuService } from 'src/app/modules/permissions/services/menu.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';

@Component({
  selector: 'app-internaldivisiontree',
  templateUrl: './internaldivisiontree.component.html',
  styleUrls: ['./internaldivisiontree.component.scss']
})
export class InternaldivisiontreeComponent implements OnInit {

  menuTree: ITreeMenu[];
  private unsubscribe: Subscription[] = [];

  public treeControl = new NestedTreeControl<ITreeMenu>((node: any) => node.childNode);
  public dataSource = new MatTreeNestedDataSource<ITreeMenu>();

  constructor(
    public dialog: MatDialog,
    private toaster: toasterService,
    private menuService: MenuService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    let updateTree = menuService.bSubject.subscribe(res => { this.getMenu(); });
    this.unsubscribe.push(updateTree);

    let getTree = menuService.menuTree.subscribe(res => {
      this.menuTree = res
      this.dataSource.data = test//res;
      Object.keys(this.dataSource.data).forEach((key: any) => { this.setParent(this.dataSource.data[key]); });
    });
    this.unsubscribe.push(getTree);
  }

  ngOnInit(): void { }

  hasChild = (_: number, node: ITreeMenu) => !!node.childNode && node.childNode.length > 0;

  setParent(node: ITreeMenu, parent?: ITreeMenu) {
    node.parent = parent;
    let level: number = node.parent ? (parent?.level ?? 0) : 0;
    node.level = level + 1;
    if (node.childNode) {
      node.childNode.forEach((childNode) => { this.setParent(childNode, node); });
    }
  }

  getNodesIds(node: ITreeMenu, Ids: number[]) {
    Ids.push(node.id)
    if (node.childNode) {
      node.childNode.forEach((child: any) => {
        this.getNodesIds(child, Ids);
      });
    }
  }

  toggleActiveDeactive(node: ITreeMenu) {
    console.log(this.menuTree)

    let ids: number[] = [];
    if (node.isDeleted) {
      if (node.parent?.isDeleted) {
        this.toaster.openWarningSnackBar('لا يمكن تفعيل هذا العنصر قبل تفعيل العنصر الاعلى له');
        return;
      } else
        ids.push(node.id);
    } else {
      this.getNodesIds(node, ids);
    }

    if (ids.length > 0) {
      this.menuService.toggleItemsActiveDeactive(ids).subscribe(
        (data: HttpReponseModel) => {
          this.toaster.openSuccessSnackBar(data.message);
          this.getMenu();
        },
        (error: any) => console.log(error)
      );
    }

  }


  ngOnDestroy() {
    this.menuService.menuTree.next([]);
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  addItem(node: ITreeMenu) {
    this.openDialog({ node: node, type: 'add' })
  }

  updateItem(node: ITreeMenu) {

    this.openDialog({ node: node, type: 'edit' })
  }

  openDialog(data: any) {
    const dialogRef = this.dialog.open(AddmenuComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        minWidth: '50%',
        data: data
      });
  }


  deleteItem(node: ITreeMenu) {
    this.confirmationDialogService.confirm('من فضلك اكد الحذف', `هل تريد حذف ${node.name} ? `)
      .then((confirmed) => {
        if (confirmed) {

          this.menuService.DeleteMenu(node.id).subscribe(
            (data: HttpReponseModel) => {
              this.menuService.bSubject.next(true);
              this.toaster.openSuccessSnackBar(data.message);
            },
            (error: any) => {
              this.toaster.openWarningSnackBar(error.toString().replace("Error:", ""));
            });

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  getMenu() {
    this.menuService.GetMenu().subscribe(
      (res: ITreeMenu[]) => {
        this.menuService.menuTree.next(res);
      },
      (err: any) => console.log(err),
      () => { }
    )
  }



}

const test:ITreeMenu[]=[
  {
    id:1,
    name:'kk',
    childNode:[
      {
        id:2,
        name:'ss',
        parentId:1
      }
    ]
  }
]
