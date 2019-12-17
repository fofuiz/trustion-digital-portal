import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';
import { GlobalService } from '../../services/global.service';
import { ValidationControlItem, ValidationControlList } from '../../model/validation-control';
import { FormControlValidationResponse } from '../../model/form-control-validation-response';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy {

  public permissionName: string;
  public formControlPermission: FormControl;
  private subscriptions = new Subscription();
  public showInvalid = {permissionName: false};
  @ViewChild('inputPermission', { static: false }) childPermission: ElementRef;

  constructor(
    private permissionsService: PermissionsService,
    public globalService: GlobalService
  ) {
    this.formControlPermission = new FormControl();
  }

  ngOnInit() {
    this.initListeners();
    this.loadFormControlList();
  }

  private initListeners() {
    this.registerOnFormControlValidation();
  }

  loadFormControlList() {
    const formControlList: ValidationControlList = {
        items: [{
          frmCtrl: this.formControlPermission,
          section: 'permission',
          field: 'name',
          filter: 'alpha',
          checkValid: true
        }]
    };
    this.globalService.formControlValidation(formControlList);
  }

  registerOnFormControlValidation() {
    this.subscriptions.add(
      this.globalService.formControlValidation$.subscribe(
        (response: FormControlValidationResponse) => {
          if (response.field === 'name') {
            this.permissionName = response.filteredValue;
            this.showInvalid.permissionName = response.isValid;
          }
        }
      )
    );
  }

  clickSavePermission() {
    this.permissionsService.savePermission(this.permissionName);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
