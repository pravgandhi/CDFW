import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';
import { UserService } from 'src/app/_services';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';


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
               private formBuilder: FormBuilder, private userService : UserService,
             private snackBar: MatSnackBarComponent ) { }

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
    if(this.loginForm.valid){
      this.authenticationService.login(this.f.username.value, this.f.password.value).then(
          isMission => {
            if(isMission){
              var mappedRegions = this.userService.user['userRegionMappingsById'];
              if(mappedRegions.length > 0){
                let  userRegion = mappedRegions[0]['regionByRegionId']['regionName'];
                this.router.navigate(['service', userRegion]);
              } else {
              //  this.snackBar.openSnackBar( `User ${this.f.username.value} does not have access to any region.`, 'Close', "red-snackbar");
                this.errMsg = `User ${this.f.username.value} does not have access to any region. `;
                this.router.navigate(['login']);
              }
            } else {
              // this.snackBar.openSnackBar( "Invalid Credentials", 'Close', "red-snackbar");
              this.errMsg = "Invalid Credentials";
              this.router.navigate(['login']);
            }
          }
      );
    }
  }
}
