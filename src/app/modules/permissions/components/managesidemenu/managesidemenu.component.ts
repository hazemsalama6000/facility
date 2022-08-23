import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { ITreeMenu } from '../../models/ITreeMenu.interface';
import { MenuService } from '../../services/menu.service';
import { AddmenuComponent } from './addmenu/addmenu.component';

@Component({
  selector: 'app-managesidemenu',
  templateUrl: './managesidemenu.component.html',
  styleUrls: ['./managesidemenu.component.scss']
})
export class ManagesidemenuComponent implements OnInit {

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
      this.dataSource.data = res;
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
    // else {
    //   this.itemToggle(node.isSelected ?? false, node)
    // }
  }

  // checkAllParents(node: ITreeMenu) {
  //   if (node.parent) {
  //     const descendants = this.treeControl.getDescendants(node.parent);
  //     node.parent.isSelected = descendants.every((child: any) => child.isSelected);
  //     node.parent.indeterminate = descendants.some((child: any) => child.isSelected);
  //     this.checkAllParents(node.parent);
  //   }
  // }

  // itemToggle(checked: boolean, node: ITreeMenu) {

  //   node.isSelected = checked;
  //   if (node.childNode) {
  //     node.childNode.forEach((child: any) => { this.itemToggle(checked, child); });
  //   } else {
  //     if (node.name == 'Full')
  //       node.parent?.childNode?.forEach((child) => { node.isSelected ? child.isSelected = true : child.isSelected = false });
  //     else {
  //       let istrue = node.parent?.childNode?.filter(x => x.name != 'Full' && x.isSelected);
  //       if (istrue?.length == 3) {
  //         node.parent?.childNode?.map((x) => { x.name == 'Full' ? x.isSelected = true : null })
  //       } else {
  //         node.parent?.childNode?.map((x) => { x.name == 'Full' ? x.isSelected = false : null })
  //       }
  //     }

  //   }
  //   this.checkAllParents(node);
  // }

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
    console.log(node.isDeleted, ids)
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
