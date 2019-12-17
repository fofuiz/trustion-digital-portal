import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { MatSidenav } from '@angular/material';
import { ModalService } from '../services/modal.service';
import { GlobalService } from '../services/global.service';
import { ModalItem } from '../model/modal-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('container', {static: false}) private container;
  @ViewChild('sidenav', {static: false}) public sidenav: MatSidenav;
  events: string[] = [];
  opened: boolean;

  constructor(
    private menuService: MenuService,
    private modalService: ModalService,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
    // this.openExampleModal();
    this.initListeners();
  }

  ngAfterViewInit() {
    this.menuService.setSidenav(this.sidenav);
  }

  private initListeners() {
  }

  setMiniBarState(state) {
    if (!state) {
      if (this.sidenav.opened) {
        this.menuService.miniBarStateSubject.next(state);
      }
    }
  }

  openExampleModal() {
    // Abrindo modal comum do sistema
    const commonModal = new ModalItem();
    commonModal.type = 'common';
    commonModal.origin = 'home';
    commonModal.name = 'common Teste';
    commonModal.title = 'Modal comum';
    commonModal.message = 'Modal de tela';
    commonModal.body = {
        algumaCoisa: 'O que quiser',
        name: 'objeto de intercâmbio',
        msg: 'Objeto interno para comunicação entre modal e o componente chamador'
    };
    commonModal.visible = true;
    commonModal.width = '640px';
    commonModal.height = '480px';

    this.modalService.showDialogWindow(commonModal);

    // Abrindo Modal Urgente do Sistema depois de 3s
    window.setTimeout(() => {
      const systemModal = new ModalItem();
      systemModal.type = 'system';
      systemModal.origin = 'home';
      systemModal.name = 'system Teste';
      systemModal.title = 'Modal do sistema';
      systemModal.message = 'Modal prioritário do sistema';
      systemModal.body = {
          algumaCoisa: 'O que quiser',
          name: 'objeto de intercâmbio',
          msg: 'Objeto interno para comunicação entre modal e o componente chamador'
      };
      systemModal.visible = true;
      systemModal.width = '320px';
      systemModal.height = '240px';

      this.modalService.showDialogWindow(systemModal);
    }, 3000);
  }
}
