import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from './dialog-data';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (!data) {
      this.data = {} as DialogData;
    }

    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]{11}'),
      ]),
    });
  }

  onCancelClick(): void {
    if (typeof this.data.onCancelClick == 'function') {
      this.data.onCancelClick();
    }
    this.dialogRef.close();
  }

  onSaveClick() {
    if (typeof this.data.onSaveClick == 'function') {
      this.data.onSaveClick(this.formGroup.value);
    }
    this.dialogRef.close();
    return;
  }
}
