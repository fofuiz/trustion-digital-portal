import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from '../services/login.service';
import { ValidationControlItem, ValidationControlList } from '../model/validation-control';
import { FormControlValidationResponse } from '../model/form-control-validation-response';
import { FormControl } from '@angular/forms';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  public user: string;
  public password: string;
  public formControluserLogin: FormControl;
  public formControluserPass: FormControl;
  public showInvalid = {user: false, password: false};
  @ViewChild('inputUser', { static: false }) childUser: ElementRef;
  @ViewChild('inputPass', { static: false }) childPass: ElementRef;

  constructor(
    public loginService: LoginService,
    public globalService: GlobalService,
    public menuService: MenuService,
    public router: Router
  ) {
    this.formControluserLogin = new FormControl();
    this.formControluserPass = new FormControl();
  }

  ngOnInit() {
    this.initListeners();
    this.loadFormControlList();
  }

  private initListeners() {
    this.registerOnFormControlValidation();
  }

  registerOnFormControlValidation() {
    this.subscriptions.add(
      this.globalService.formControlValidation$.subscribe(
        (response: FormControlValidationResponse) => {
          if (response.field === 'user') {
            this.user = response.filteredValue;
            this.showInvalid.user = response.isValid;
          } else if (response.field === 'password') {
            this.password = response.filteredValue;
            this.showInvalid.password = response.isValid;
          }
        }
      )
    );
  }

  loadFormControlList() {
    const itemLogin: ValidationControlItem = {
      frmCtrl: this.formControluserLogin,
      section: 'login',
      field: 'user',
      filter: '',
      checkValid: true
    };
    const itemPass: ValidationControlItem = {
      frmCtrl: this.formControluserPass,
      section: 'login',
      field: 'password',
      filter: '',
      checkValid: true
    };
    const formControlList: ValidationControlList = {
      items: [itemLogin, itemPass]
    };
    this.globalService.formControlValidation(formControlList);
  }

  clickLogin() {
    this.user = this.childUser.nativeElement.value;
    this.password = this.childPass.nativeElement.value;
    this.loginService.login(this.user, this.password);
    // this.loginService.login('admin_trustion', 'Trustion@admin2019');
  }

  clickLogout() {
    this.loginService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
