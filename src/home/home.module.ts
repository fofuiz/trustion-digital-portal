import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { HeaderModule } from '../shared/header/header.module';
import { MenuModule } from '../shared/menu/menu.module';
import { UsersModule } from '../manager/users/users.module';
import { RolesModule } from '../manager/roles/roles.module';
import { PermissionsModule } from '../manager/permissions/permissions.module';
import { CommonDialogModule } from '../shared/common-dialog/common-dialog.module';
import { SystemDialogModule } from '../shared/system-dialog/system-dialog.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    HeaderModule,
    MenuModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    CommonDialogModule,
    SystemDialogModule
  ],
  exports: [
    MaterialModule,
    HeaderModule,
    MenuModule,
    RouterModule,
    CommonDialogModule,
    SystemDialogModule
  ],
  providers: [
    MenuService
  ]
})
export class HomeModule { }
