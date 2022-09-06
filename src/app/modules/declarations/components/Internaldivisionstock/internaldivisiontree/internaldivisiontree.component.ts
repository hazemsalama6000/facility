import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { toasterService } from 'src/app/core-module/UIServices/toaster.service';
import { AddmenuComponent } from 'src/app/modules/permissions/components/managesidemenu/addmenu/addmenu.component';
import { ITreeStockShelfs, StockShelfsFlatNode } from 'src/app/modules/declarations/models/ITreeStockShelfs.interface';
import { ConfirmationDialogService } from 'src/app/shared-module/Components/confirm-dialog/confirmDialog.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { StockShelfsService } from '../../../services/StockShelfs.service';
import { AddinternaldivisionComponent } from '../addinternaldivision/addinternaldivision.component';
import { HttpReponseModel } from 'src/app/core-module/models/ResponseHttp';

@Component({
  selector: 'app-internaldivisiontree',
  templateUrl: './internaldivisiontree.component.html',
  styleUrls: ['./internaldivisiontree.component.scss']
})
export class InternaldivisiontreeComponent {
  treeControl: FlatTreeControl<StockShelfsFlatNode>;
  treeFlattener: MatTreeFlattener<ITreeStockShelfs, StockShelfsFlatNode>;
  dataSource: MatTreeFlatDataSource<ITreeStockShelfs, StockShelfsFlatNode>;
  expansionModel = new SelectionModel<number>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  objHover: any;
  stockShelfsTree: ITreeStockShelfs[];
  stockId: number = 0;
  private unsubscribe: Subscription[] = [];

  constructor(
    private stockShelfsService: StockShelfsService,
    public dialog: MatDialog,
    private toaster: toasterService,
    private confirmationDialogService: ConfirmationDialogService
  ) {

    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<StockShelfsFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    stockShelfsService.stockShelfTree.subscribe(res => this.rebuildTreeForData(res));

    const stockIddata = this.stockShelfsService.StockId.subscribe(res => this.stockId = res);
    this.unsubscribe.push(stockIddata);
  }

  transformer = (node: ITreeStockShelfs, level: number) => { return new StockShelfsFlatNode(!!node.children, node.name, level, node.id, node.parent_Id ?? 0, node.isActive ?? true, false); };
  private _getLevel = (node: StockShelfsFlatNode) => node.level;
  private _isExpandable = (node: StockShelfsFlatNode) => node.expandable;
  private _getChildren = (node: ITreeStockShelfs): Observable<ITreeStockShelfs[]> => of(node.children ?? []);
  hasChild = (_: number, _nodeData: StockShelfsFlatNode) => _nodeData.expandable;

  visibleNodes(): ITreeStockShelfs[] {
    const result: any = [];

    function addExpandedChildren(node: ITreeStockShelfs, expanded: number[]) {
      result.push(node);
      expanded.includes(node.id) ? node.children?.map((child: any) => addExpandedChildren(child, expanded)) : null;
    }

    this.dataSource.data.forEach((node) => { addExpandedChildren(node, this.expansionModel.selected); });
    return result;
  }

  drop(event: CdkDragDrop<string[]>) {
    let movedObj: any = event.item.data;

    if (this.objHover.level > movedObj.level) {
      alert('bbb')
    } else {
      console.log(movedObj, "======>", this.objHover)
      this.visibleNodes();
      this.stockShelfsService.updateParentShelf({ stockShelfId: movedObj.id, parentId: this.objHover.id, stock_Id: this.stockId }).subscribe(
        (data: HttpReponseModel) => {
          this.toaster.openSuccessSnackBar(data.message);
          this.stockShelfsService.bSubject.next(true);
        },
        (error: any) => console.log(error)
      );
    }
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
      const node = this.treeControl.dataNodes.find((n) => n.id === id) as StockShelfsFlatNode;
      this.treeControl.expand(node);
    });
  }


  getNodesIds(node: ITreeStockShelfs, Ids: number[]) {
    Ids.push(node.id)
    if (node.children) {
      node.children.forEach((child: any) => {
        this.getNodesIds(child, Ids);
      });
    }
  }

  addItem(node: any) {
    console.log(node)
    const dialogRef = this.dialog.open(AddinternaldivisionComponent,
      {
        maxHeight: '100vh',
        minHeight: '50%',
        minWidth: '50%',
        data: { node: node }
      });
  }

  updateItem(node: any) {
    if (node.name == '' || node.name == null) {
      this.toaster.openWarningSnackBar("برجاء ادخال الاسم");
      return;
    }

    if (node.name.length < 3) {
      this.toaster.openWarningSnackBar("يجب ان لايقل الاسم عن 3 احرف");
      return;
    }

    this.stockShelfsService.updateStockShelf({ stockShelfId: node.id, stock_Id: this.stockId, name: node.name }).subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          this.stockShelfsService.bSubject.next(false);
          this.toaster.openSuccessSnackBar(data.message);
        }
        else {
          this.toaster.openWarningSnackBar(data.message);
        }
      },
      (error: any) => { this.toaster.openWarningSnackBar(error); console.log(error) }
    );
  }

  toggleActiveDeactive(node: any) {

    // let ids: number[] = [];
    // if (node.isActive) {
    //   if (node.parent?.isActive) {
    //     this.toaster.openWarningSnackBar('لا يمكن تفعيل هذا العنصر قبل تفعيل العنصر الاعلى له');
    //     return;
    //   } else
    //     ids.push(node.id);
    // } else {
    //   this.getNodesIds(node, ids);
    // }

    // if (ids.length > 0) {
    this.stockShelfsService.toggleItemsActiveDeactive(node.id).subscribe(
      (data: HttpReponseModel) => {
        if (data.isSuccess) {
          this.stockShelfsService.bSubject.next(false);
          this.toaster.openSuccessSnackBar(data.message);
        }
        else if (data.isExists) {
          this.toaster.openWarningSnackBar(data.message);
        }
      },
      (error: any) => { this.toaster.openWarningSnackBar(error); console.log(error) }
    );
    // }

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
