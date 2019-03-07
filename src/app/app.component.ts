import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Service Based Budgeting Project Data Collection Tool';

  constructor(private userService:UserService) {}

  getUserDetails() {
      //this.router.navigate(['/heroes']);
  }

  getDataType(){
    if(this.userService.user != null){
      if(this.userService.user['dataTypeByDataTypeId']['dataType'] == 'mission'){
        return ' - Mission Level';
      } else if(this.userService.user['dataTypeByDataTypeId']['dataType'] == 'current'){
        return ' - Current State'
      } 
    } 
    return '';
  }

}
