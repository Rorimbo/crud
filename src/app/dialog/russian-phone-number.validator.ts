import { AbstractControl } from '@angular/forms';

export function russianPhoneNumberValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  if (!control.value) {
    return null;
  }
  const phoneNumberRegex = /^((\+7|7|8)+(9)+([0-9]){9})$/;
  const isValid = phoneNumberRegex.test(control.value);

  return isValid ? null : { russianPhoneNumber: true };
}
