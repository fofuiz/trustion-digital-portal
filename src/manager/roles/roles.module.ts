import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { MaterialModule } from '../../shared/material.module';
import { TabulatorModule } from '../../shared/tabulator/tabulator.module';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TabulatorModule
  ],
  exports: [
    RolesComponent,
    TabulatorModule
  ]
})
export class RolesModule { }
