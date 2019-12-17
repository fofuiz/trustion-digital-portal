import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-system-dialog',
  templateUrl: './system-dialog.component.html',
  styleUrls: ['./system-dialog.component.scss']
})

export class SystemDialogComponent implements OnInit {

  public dataStringified;

  constructor(
    public dialogRef: MatDialogRef<SystemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.dataStringified = JSON.stringify(this.data);
  }

}
