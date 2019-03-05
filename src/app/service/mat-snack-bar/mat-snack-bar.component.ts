import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-mat-snack-bar',
  templateUrl: './mat-snack-bar.component.html',
  styleUrls: ['./mat-snack-bar.component.css']
})
export class MatSnackBarComponent implements OnInit {

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  // this function will open up snackbar on top right position with custom background color (defined in css)
openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
     duration: 4000,
     verticalPosition: 'bottom',
     horizontalPosition: 'right',
     panelClass: [className],
    });
}

}