import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogContainer } from '@angular/material';
import { Subscription } from 'rxjs/internal/Subscription';
import { GlobalService } from '../services/global.service';
import { CommonDialogComponent } from '../shared/common-dialog/common-dialog.component';
import { SystemDialogComponent } from '../shared/system-dialog/system-dialog.component';
import { ModalDialog } from 'src/model/modal-dialog';
import { ModalList, ModalListItem } from 'src/model/modal-list';
import { SearchList, SearchResult } from 'src/model/modal-search';
import { Subject } from 'rxjs';
import { ModalItem } from '../model/modal-item';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalControlSubject = new Subject<ModalListItem>();
  modalControl$ = this.modalControlSubject.asObservable();

  private modalErrorSubject = new Subject<string>();
  modalError$ = this.modalErrorSubject.asObservable();

  private subscriptions = new Subscription();
  public localModalList = new ModalList();
  public localSearchList = new SearchList();
  public commonDialogRef: MatDialogRef<CommonDialogComponent>;
  public systemDialogRef: MatDialogRef<SystemDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private globalService: GlobalService
  ) {
    this.initListeners();
  }

  private initListeners(): void {
    this.registerOnModal();
  }

  public registerOnModal() {
    this.subscriptions.add(
      this.modalControl$.subscribe((modalListItem: ModalListItem) => {
        if (modalListItem.visible) {
          this.showModal(modalListItem);
        } else {
          this.closeModal(modalListItem);
        }
      })
    );
  }

  public showModal(modalListItem: ModalListItem) {
    const component = (modalListItem.type === 'common') ? CommonDialogComponent : SystemDialogComponent;
    modalListItem.dialog = this.dialog.open(
      component,
      {
        height: modalListItem.modal.height,
        width: modalListItem.modal.width,
        data: modalListItem.modal.body,
        disableClose: false
      }
    );
  }

  public closeModal(modalListItem: ModalListItem) {
    modalListItem.dialog.close();
  }

  public showDialogWindow(
    modalItem: ModalItem,
    modalList: ModalList = this.localModalList ) {

    const searchList: SearchList = {
      items: [
        { prop: 'name', value: modalItem.name },
        { prop: 'origin', value: modalItem.origin }
      ]
    };
    const hasItem: SearchResult = this.getModalListItem(modalList, searchList);

    if (!hasItem) {
      const modal = new ModalDialog();
      modal.title = modalItem.title;
      modal.message = modalItem.message;
      modal.body = modalItem.body;
      modal.width = modalItem.width;
      modal.height = modalItem.height;

      const modalListItem = new ModalListItem();
      modalListItem.type = modalItem.type;
      modalListItem.dialog = (modalItem.type === 'common') ? this.commonDialogRef : this.systemDialogRef;
      modalListItem.name = name;
      modalListItem.origin = origin;
      modalListItem.identifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      modalListItem.visible = modalItem.visible;
      modalListItem.modal = modal;
      modalList.items.push(modalListItem);
      this.modalControlSubject.next(modalListItem);
    } else {
      let modalToToggle = new SearchList();
      modalToToggle = {items: [{prop: 'name', value: hasItem.item.name}]};
      this.toggleDialog(undefined, modalToToggle);
      // this.modalControlSubject.next(hasItem.item);
    }
  }

  public removeDialogFromListItem(
    modalList: ModalList = this.localModalList,
    searchList: SearchList = this.localSearchList) {

    const result: SearchResult = this.getModalListItem(modalList, searchList);
    if (result) {
      if (result.item.visible) {
        result.item.visible = !result.item.visible;
        this.modalControlSubject.next(result.item);
      }
      modalList.items.splice(result.index, 1);
    }
  }

  public getModalListItem(
    modalList: ModalList = this.localModalList,
    searchList: SearchList = this.localSearchList): SearchResult {

    const item = modalList.items.find(listItem => {
      let found = 0;
      searchList.items.forEach(searchItem => {
        found += (listItem[searchItem.prop] === searchItem.value) ? 1 : 0;
      });
      return (found === searchList.items.length) ? true : false;
    });
    if (item) {
      const result = new SearchResult();
      result.index = modalList.items.indexOf(item);
      result.item = item;
      return result;
    } else {
      this.modalErrorSubject.next('Modal não existe');
      return null;
    }
  }

  public toggleDialog(
    modalList: ModalList = this.localModalList,
    searchList: SearchList = this.localSearchList) {
    const result: SearchResult = this.getModalListItem(modalList, searchList);
    if (result) {
      result.item.visible = !result.item.visible;
      this.modalControlSubject.next(result.item);
    }
  }
}
