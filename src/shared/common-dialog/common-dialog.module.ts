import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonDialogComponent } from './common-dialog.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [CommonDialogComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  entryComponents: [
    CommonDialogComponent
  ]
})
export class CommonDialogModule {}
