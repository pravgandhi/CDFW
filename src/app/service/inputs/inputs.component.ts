import { Component, OnInit, AfterViewInit, Inject, Input } from '@angular/core';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { UserService } from 'src/app/_services';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent implements OnInit  {

  selectedRowIndex: number = -1;
  selectedRow: any;
  selectedRegionObject: any;
  user: any;
  inputs = new MatTableDataSource<Object>();
  inputDisplayedColumns: string[] = [  "name", "status", "approverName", "feedback", "value", "totalHours"];
  approvedInput: number;

  errorMessage: string = null;
  successMessage: string = null;
  userRole: string;
  // data: any;
  @Input('regionName') regionName: string;
  @Input('taskId') taskId: string;
  @Input('totalHours') totalHours: number;
  @Input('changeDetection') changeDetection: boolean;

  constructor(private serviceMatrix : ServiceMatrixService,
              // public dialogRef : MatDialogRef<InputsComponent>,
              private userService:UserService,
            // @Inject(MAT_DIALOG_DATA) public data: any,
          private router: Router, private snackBar: MatSnackBarComponent
         ) {

          }

  ngOnInit() {
    this.user = this.userService.user;
    this.userRole = this.userService.userRole;
    this.selectedRegionObject = this.userService.getSelectedRegionObject(this.regionName);
    this.fetchInputs();
  }

  ngOnChanges() {
    console.log(this.taskId);
    this.selectedRegionObject = this.userService.getSelectedRegionObject(this.regionName);
    this.fetchInputs();
  }

  fetchInputs(){
    let _self = this;
    this.serviceMatrix.fetchInputs(this.selectedRegionObject.regionId, this.taskId ).subscribe(
    data => {
      _self.inputs.data = data as Object[];
    },
    err => {
      this.errorMessage = "Error fectching input values. Please try again later."
    });
  }

  approveResponse(){
    this.serviceMatrix.selectedRowIndex = this.selectedRowIndex;
    let _self = this;
    this.serviceMatrix.selectInput(this.selectedRegionObject.regionId, this.taskId,this.selectedRow.id, this.userService.userId).subscribe(
    data => {
      _self.approvedInput = Number(data);
      this.snackBar.openSnackBar( "Selected Input is approved", 'Close', "green-snackbar");
      this.fetchInputs();
      // this.dialogRef.close(this.data);
    },
    err => {
        this.snackBar.openSnackBar( "Error saving selected input", 'Close', "red-snackbar");
        this.onClose();
    });
  }

  provideYourInput() {
    this.onClose();
  }

  highlight(row){
    var myJSON = JSON.stringify(row);
    this.selectedRowIndex = row.id;
    this.selectedRow = row;
  }

  onClose() {
    // this.dialogRef.close();
  }

  /*openSnackBar(message: string, action: string) {
  let config = new MatSnackBarConfig();
   config.verticalPosition = 'bottom';
   config.horizontalPosition = 'right';
   config.duration = 2000;
    this.snackBar.open(message, action, config);
  } */

}
