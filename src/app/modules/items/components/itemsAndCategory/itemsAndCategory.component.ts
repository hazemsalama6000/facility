import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { Subscription } from "rxjs";
import { HttpReponseModel } from "src/app/core-module/models/ResponseHttp";
import { toasterService } from "src/app/core-module/UIServices/toaster.service";
import { AuthService } from "src/app/modules/auth";
import { IUserData } from "src/app/modules/auth/models/IUserData.interface";
import { ConfirmationDialogService } from "src/app/shared-module/Components/confirm-dialog/confirmDialog.service";
import { IItemsCategory, IItemsCategoryFlat } from "../../../items/models/itemsCategory/IItemsCategory.interface";
import { ItemsCategoryService } from "../../../items/services/itemsCategory.service";
import { UpsertcategoryComponent } from "./upsertcategory/upsertcategory.component";
import { UpsertitemComponent } from "./upsertitem/upsertitem.component";

@Component({
  selector: 'app-itemsAndCategory',
  templateUrl: './itemsAndCategory.component.html',
  styleUrls: ['./itemsAndCategory.component.scss']
})
export class ItemsAndCategoryComponent {

  treeControl: FlatTreeControl<IItemsCategoryFlat>;
  treeFlattener: MatTreeFlattener<IItemsCategory, IItemsCategoryFlat>;
  dataSource: MatTreeFlatDataSource<IItemsCategory, IItemsCategoryFlat>;
  flatNodeMap = new Map<IItemsCategoryFlat, IItemsCategory>();
  nestedNodeMap = new Map<IItemsCategory, IItemsCategoryFlat>();
  expansionModel = new SelectionModel<number>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  objHover: any;
  dnode: IItemsCategoryFlat = {
    id: 0, isActive: true, name: '', type: '',
    parentId: 0,
    company_Id: 0,
    children: [],
    level: 0,
    expandable: false
  }
  // stockShelfsTree: IItemsCategory[];
  itemsCtegory: IItemsCategory[] = [];
  userDate: IUserData;
  private unsubscribe: Subscription[] = [];

  constructor(
    private itemsCategoryService: ItemsCategoryService,
    private authService: AuthService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<IItemsCategoryFlat>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    let data = authService.userData.subscribe(res => {
      this.userDate = res;
      let changes = itemsCategoryService.bSubject.subscribe(res => this.getItemAndCategoryTree());
      this.unsubscribe.push(changes);
    });
    this.unsubscribe.push(data);

  }


  getLevel = (node: IItemsCategoryFlat) => node.level;

  isExpandable = (node: IItemsCategoryFlat) => node.expandable;

  getChildren = (node: IItemsCategory): IItemsCategory[] | null => node.children ?? null;

  hasChild = (_: number, _nodeData: IItemsCategoryFlat) => _nodeData.expandable;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: IItemsCategory, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.id === node.id ? existingNode : new IItemsCategoryFlat();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.isActive = true;
    flatNode.parentId = node.parentId as number;
    flatNode.children = node.children ?? [];
    flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children && node.children.length > 0;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: IItemsCategoryFlat): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.expansionModel.isSelected(child.id));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: IItemsCategoryFlat): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.expansionModel.isSelected(child.id));
    return result && !this.descendantsAllSelected(node);
  }

  filterChanged(filterText: string) {
    this.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  public filter(filterText: string) {
    let filteredTreeData: IItemsCategory[];
    if (filterText) {
      filteredTreeData = this.itemsCtegory.filter(d => d.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
      Object.assign([], filteredTreeData).forEach((ftd: any) => {
        let str = (<string>ftd.name);
        while (str.lastIndexOf('.') > -1) {
          const index = str.lastIndexOf('.');
          str = str.substring(0, index);
          if (filteredTreeData.findIndex(t => t.name === str) === -1) {
            const obj = this.itemsCtegory.find(d => d.name === str);
            if (obj)
              filteredTreeData.push(obj);
          }
        }
      });
    } else {
      filteredTreeData = this.itemsCtegory;
    }

    const data = this.rebuildTreeForData(filteredTreeData);
  }


  visibleNodes(): IItemsCategory[] {
    const result: any = [];
    function addExpandedChildren(node: IItemsCategory, expanded: number[]) {
      result.push(node);
      expanded.includes(node.id) ? node.children?.map((child: any) => addExpandedChildren(child, expanded)) : null;
    }

    this.dataSource.data.forEach((node) => { addExpandedChildren(node, this.expansionModel.selected); });
    return result;
  }

  drop(event: CdkDragDrop<string[]>) {
    let movedObj: any = event.item.data;

    if (this.objHover.level > movedObj.level) {
      this.toaster.openWarningSnackBar('لايمكن اضافة صنف او تصنيف تحت نفسه')
    } else {
      if (this.objHover.type != "Item") {

        console.log(movedObj, "======>", this.objHover)

        this.visibleNodes();
        if (movedObj.type == "Category") {
          this.itemsCategoryService.updateParentCategory({ categoryId: movedObj.id, parentId: this.objHover.id }).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.itemsCategoryService.bSubject.next(true);
            },
            (error: any) => console.log(error)
          );
        } else {

          this.itemsCategoryService.updateParentItem({ item_Id: movedObj.id, category_Id: this.objHover.id }).subscribe(
            (data: HttpReponseModel) => {
              this.toaster.openSuccessSnackBar(data.message);
              this.itemsCategoryService.bSubject.next(true);
            },
            (error: any) => console.log(error)
          );
        }

      }else
      this.toaster.openWarningSnackBar('لايمكن اضافة صنف او تصنيف تحت صنف')
    }
    this.objHover = null;
  }
  dragStart = () => this.dragging = true;
  dragEnd = (node: any) => this.dragging = false;
  dragHover(node: any) {
    if (this.dragging) {
      this.objHover = node;
      clearTimeout(this.expandTimeout);
      this.expandTimeout = setTimeout(() => {
        this.treeControl.expand(node);
      }, this.expandDelay);
    }
  }

  dragHoverEnd = () => { this.dragging ? clearTimeout(this.expandTimeout) : null; }

  rebuildTreeForData(data: any) {
    this.dataSource.data = data;
    this.expansionModel.selected.forEach((id) => {
      const node = this.treeControl.dataNodes.find((n) => n.id === id) as IItemsCategoryFlat;
      this.treeControl.expand(node);
    });
  }

  getNodesIds(node: IItemsCategory, Ids: number[]) {
    Ids.push(node.id)
    if (node.children) {
      node.children.forEach((child: any) => {
        this.getNodesIds(child, Ids);
      });
    }
  }

  addItem(node: any, type: string) {
    console.log(node)
    if (type == 'Category') {
      const dialogRef = this.dialog.open(UpsertcategoryComponent,
        {
          maxHeight: '100vh',
          minHeight: '50%',
          minWidth: '50%',
          data: { node: node, type: 'add' }
        });
    } else {
      const dialogRef = this.dialog.open(UpsertitemComponent,
        {
          maxHeight: '100vh',
          minHeight: '50%',
          minWidth: '50%',
          data: { node: node, type: 'add' }
        });
    }

  }

  updateItem(node: any) {
    if (node.type == 'Category') {
      const dialogRef = this.dialog.open(UpsertcategoryComponent,
        {
          maxHeight: '100vh',
          minHeight: '50%',
          minWidth: '50%',
          data: { node: node, type: 'edit' }
        });
    } else {
      const dialogRef = this.dialog.open(UpsertitemComponent,
        {
          maxHeight: '100vh',
          minHeight: '50%',
          minWidth: '50%',
          data: { node: node, type: 'edit' }
        });
    }

  }

  toggleActiveDeactive(node: IItemsCategoryFlat) {
    if (node.type == 'Item') {
      this.itemsCategoryService.toggleItemsActiveDeactive(node.id).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.itemsCategoryService.bSubject.next(false);
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => { this.toaster.openWarningSnackBar(error); console.log(error) }
      );

    } else {
      this.itemsCategoryService.toggleCategotyActiveDeactive(node.id).subscribe(
        (data: HttpReponseModel) => {
          if (data.isSuccess) {
            this.itemsCategoryService.bSubject.next(false);
            this.toaster.openSuccessSnackBar(data.message);
          }
          else if (data.isExists) {
            this.toaster.openWarningSnackBar(data.message);
          }
        },
        (error: any) => { this.toaster.openWarningSnackBar(error); console.log(error) }
      );

    }
  }

  getItemAndCategoryTree() {
    this.itemsCategoryService.getItemsCategory(this.userDate.companyId).subscribe((res) => {
      this.itemsCtegory = res;
      this.rebuildTreeForData(res)
    }, (err) => console.log(err))
  }

  ngOnDestroy() {
    this.nestedNodeMap.values()
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}