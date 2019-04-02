import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, ErrorStateMatcher, MatDialogConfig } from '@angular/material';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  show: boolean = false;
  userName: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  errMsg: string = null;

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder, private userService: UserService, private dialog: MatDialog,
    private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    // reset login status
    this.authenticationService.logout();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  login() {
    this.router.navigate(['service']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      var self = this;
      this.authenticationService.login(this.f.username.value, this.f.password.value).then(
        validUser => {
          if (validUser) {
            var mappedRegions = self.userService.user != undefined ? self.userService.user['userRegionMappingsById'] : null;
            if (mappedRegions != null && mappedRegions.length > 0) {
              let userRegion = mappedRegions[0]['regionByRegionId']['regionName'];
              if(self.userService.user['dataTypeByDataTypeId']['dataType'] == 'mission') {
                  self.router.navigate(['service', userRegion]);
              } else if (self.userService.user['dataTypeByDataTypeId']['dataType'] == 'current') {
                 self.router.navigate(['currentState']);
              } else if (self.userService.user['dataTypeByDataTypeId']['dataType'] == 'both'){
                  this.chooseDataType(userRegion);
              }
            } else {
              //  this.snackBar.openSnackBar( `User ${this.f.username.value} does not have access to any region.`, 'Close', "red-snackbar");
              self.errMsg = `User does not have access to any region. `;
              self.router.navigate(['login']);
            }
          } else {
            // this.snackBar.openSnackBar( "Invalid Credentials", 'Close', "red-snackbar");
            self.errMsg = "Invalid Credentials";
            self.router.navigate(['login']);
          }
        }
      );
    }
  }

  resetPassword() {
    const dialogRef = this.dialog.open(ResestPasswordDialog, {
      width: '500px',
      data: { confirm: 'No' }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  chooseDataType(userRegion:any){
    status = 'A';

      const dialogRef = this.dialog.open(DataTypeSelectionDialog, {
        width: '500px',
        data: {confirm: 'No'}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.confirm == 'mission'){
          this.router.navigate(['service', userRegion]);
        } else {
          this.router.navigate(['currentState']);
        }
      });

  }
}


@Component({
  selector: 'reset-password-dialog',
  templateUrl: 'reset-password-dialog.html',
})
export class ResestPasswordDialog {

  resetForm: FormGroup;
  errorMsg: string;

  constructor(
    public dialogRef: MatDialogRef<ResestPasswordDialog>, private authenticationService: AuthenticationService, private snackBar: MatSnackBarComponent,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.resetForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  checkPasswords() {
    let pass = this.resetForm.controls.newPassword.value;
    let confirmPass = this.resetForm.controls.confirmPassword.value;
    if (pass === confirmPass) {
      return true;
    } else {
      return false;
    }
  }

  resetPassword() {
    if (this.checkPasswords() == false) {
      this.resetForm.controls['confirmPassword'].setErrors({ 'incorrect': true });
    } else {
      this.resetForm.controls['confirmPassword'].setErrors(null);
      this.authenticationService.resetPassword(this.resetForm.controls['userName'].value, this.resetForm.controls['password'].value, this.resetForm.controls['newPassword'].value)
        .subscribe(res => {
          if (res != null) {
            this.snackBar.openSnackBar("Password saved successfully", 'Close', "green-snackbar");
            this.closeDialog('Yes');
          } else {
            this.errorMsg = "Invalid user credentials"
          }
        })
    }
  }

  closeDialog(confirm): void {
    this.dialogRef.close({ 'confirm': confirm });
  }
}

@Component({
  selector: 'data-type-selection-dialog',
  templateUrl: 'data-type-selection-dialog.html',
})
export class DataTypeSelectionDialog {

  constructor(
    public dialogRef: MatDialogRef<DataTypeSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog(confirm): void{
    this.dialogRef.close({'confirm': confirm});
  }

}
