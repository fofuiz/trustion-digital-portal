import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemDialogComponent } from './system-dialog.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [SystemDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    SystemDialogComponent
  ]
})
export class SystemDialogModule {}
