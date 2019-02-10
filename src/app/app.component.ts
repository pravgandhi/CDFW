import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SBB';


  getUserDetails() {
    alert('Successfully logged in ');
    //this.router.navigate(['/heroes']);
  }

}
