import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable, of, Subject } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Login } from '../model/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuNode } from '../model/menuitems';
import { debounceTime, pairwise } from 'rxjs/operators';
import { FormControlValidationResponse } from '../model/form-control-validation-response';
import { ValidationControlItem, ValidationControlList } from '../model/validation-control';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public dialogRef;
  public showInvalid = {};
  public hasChanged: boolean;
  public validation = false;
  public loginInfo: Login;
  public menuItems: Array<MenuNode>;
  public elementsForTheme: any;

  public formControlValidationSubject = new Subject<FormControlValidationResponse>();
  formControlValidation$: Observable<FormControlValidationResponse> = this.formControlValidationSubject.asObservable();

  public changeThemeSubject = new Subject<string>();
  changeTheme$: Observable<string> = this.changeThemeSubject.asObservable();

  public check = {
    login: {
      user: { isValid: false },
      password: { isValid: false }
    },
    permission: {
      name: { isValid: false }
    }
  };

  constructor(
    private jwtHelper: JwtHelperService
  ) {}

  isAccessTokenInvalid() {
    const token = localStorage.getItem('access_token');
    return (!!token) ? this.jwtHelper.isTokenExpired(token) : true;
  }

    /////////////////////////////
   // FORM CONTROL VALIDATION //
  /////////////////////////////

  formControlValidation(formControlList: ValidationControlList) {
    formControlList.items.forEach((formControlItem) => {
      this.setActionOnInput(formControlItem);
    });
  }

  setActionOnInput(item: ValidationControlItem) {
    const frmCtrl = item.frmCtrl;
    frmCtrl.valueChanges.pipe(
      pairwise(),
      debounceTime(50))
      .subscribe(([prev, value]: [any, any]) => {
        let fil = value;
        const response: FormControlValidationResponse = {
          field: item.field,
          section: item.section,
          isValid: false,
          filteredValue: '',
        };
        if (item.checkValid) {
          this.hasChanged = (value !== prev) ? true : false;
          fil = this.filterOnly(item.filter, value);
          if (value !== fil) {
            this.hasChanged = true;
            frmCtrl.setValue(fil);
          }
          response.isValid = (frmCtrl.dirty && fil === '');
          this.checkValid(item, 'input', fil);
        }
        response.filteredValue = fil;
        this.formControlValidationSubject.next(response);
      }
    );
  }

  checkValid(formControlItem: ValidationControlItem, type, value) {
    const itemSection = formControlItem.section;
    const itemField = formControlItem.field;
    let isEmpty;
    this.check[itemSection][itemField].isValid = false;
    if (type === 'input') {
      isEmpty = (value === '');
      if (this.hasChanged) {
        if (!isEmpty) {
          this.check[itemSection][itemField].isValid = true;
        }
      }
    } else if (type === 'select') {
      this.check[itemSection][itemField].isValid = true;
    }
    const keys = Object.keys(this.check[itemSection]);
    const keysLen = keys.length;
    let validation = 0;
    for (let j = 0; j < keysLen; j++) {
      if (this.check[itemSection][keys[j]].isValid) {
        validation++;
      }
    }
    if (validation === keysLen) {
      this.validation = true;
    } else {
      this.validation = false;
    }
  }

  filterOnlyReturnCondition(type, char) {
    let cond = false;
    const code = char.charCodeAt(0);
    if (type === 'alpha') {
      cond = (code >= 97 && code <= 122) || (code >= 65 && code <= 90) || code === 32;
    } else if (type === 'alphaNum') {
      cond = (code >= 97 && code <= 122) || (code >= 65 && code <= 90) || (code >= 48 && code <= 57) || code === 32;
    } else if (type === 'number') {
      cond = (code >= 48 && code <= 57);
    } else {
      cond = true;
    }
    return cond;
  }

  filterOnly(type, inputString) {
    let cond = false;
    let word = '';
    let char = '';
    for (char of inputString) {
      cond = this.filterOnlyReturnCondition(type, char);
      if (cond) {
        word += char;
      }
    }
    return word;
  }

  setHttpResponse(data) {
    const response = new HttpResponse({
      status: 200,
      body: data
    });
    return of(response);
  }

  setHttpErrorResponse(code, msg) {
    const response = new HttpErrorResponse({
      status: code,
      statusText: msg
    });
    return of(response);
  }
}
