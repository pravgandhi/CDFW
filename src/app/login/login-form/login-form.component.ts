import { Component, OnInit } from '@angular/core';
import { MatIconModule} from '@angular/material'
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  getUserDetails() {
    this.router.navigate(["service"]);
  }

}
