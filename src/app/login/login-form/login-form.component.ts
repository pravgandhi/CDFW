import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  show: boolean = false;
  userName:string;
  password:string;
  loginForm: FormGroup;

  constructor(private router: Router, private authenticationService: AuthenticationService,
               private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
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
    this.authenticationService.login(this.f.username.value, this.f.password.value).then(
         isMission => {
           if(isMission){
              this.router.navigate(['service']);
           } else if (isMission){
             this.router.navigate(['login']);
           } else {
             this.router.navigate(['login']);
           }
         }
    );

  }
}
