import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function passwordMatchValidator(formGroup: FormGroup): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get('password');
    const validatePasswordControl = formGroup.get('validatePassword');

    if (passwordControl && validatePasswordControl) {
      return passwordControl.value === validatePasswordControl.value
        ? null
        : { mismatch: true };
    }
    return null;
  };
}
