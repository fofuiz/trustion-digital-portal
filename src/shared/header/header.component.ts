import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from '../../services/login.service';
import { FormControl } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  public user: string;
  public password: string;
  public showInvalid = {};
  public formControlList: Array<object>;
  public formControluserLogin: FormControl;
  public formControluserPass: FormControl;
  public urlLogo: string;

  constructor(
    public loginService: LoginService,
    public menuService: MenuService,
    public globalService: GlobalService,
    public router: Router
  ) {
    this.formControluserLogin = new FormControl();
    this.formControluserPass = new FormControl();
  }

  ngOnInit() {
    this.initListeners();
  }

  private initListeners() {}

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  openMenu() {
    this.menuService.openMenu();
  }

  closeMenu() {
    this.menuService.closeMenu();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  clickLogout() {
    this.loginService.logout();
  }
}
