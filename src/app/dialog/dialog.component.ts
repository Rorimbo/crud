import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { russianPhoneNumberValidator } from './russian-phone-number.validator';
import { DialogData } from '../types/dialog-data';

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
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [russianPhoneNumberValidator]),
    });

    if (this.data.clientData) {
      this.formGroup.setValue(this.data.clientData);
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (typeof this.data.onSaveClick == 'function') {
      this.data.onSaveClick(this.formGroup.value);
    }
    this.dialogRef.close();
  }

  checkIfFieldFilled(fieldCode: string): boolean {
    return (
      this.formGroup.controls[fieldCode].value &&
      this.formGroup.controls[fieldCode].valid &&
      this.formGroup.controls[fieldCode]
    );
  }
}
