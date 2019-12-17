import { ModalDialog } from '../model/modal-dialog';
import { MatDialogRef } from '@angular/material';

export class ModalListItem {
  public type: string;
  public dialog: any;
  public identifier: string;
  public name: string;
  public origin: string;
  public visible: boolean;
  public modal: ModalDialog;
  constructor() {
    this.type = '';
    this.dialog = {};
    this.identifier = '';
    this.name = '';
    this.origin = '';
    this.visible = false;
    this.modal = new ModalDialog();
  }
}

export class ModalList {
  public items;
  constructor() {
    this.items = [new ModalListItem()];
  }
}
