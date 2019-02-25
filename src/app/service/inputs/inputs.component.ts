import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UserService } from 'src/app/_services';
import { Router } from '@angular/router';

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
  inputDisplayedColumns: string[] = [ "value", "name", "status"];

  errorMessage: string = null;
  successMessage: string = null;

  constructor(private serviceMatrix : ServiceMatrixService,
              public dialogRef : MatDialogRef<InputsComponent>,
              private userService:UserService,
            @Inject(MAT_DIALOG_DATA) public data: any,
          private router: Router,
        private snackBar: MatSnackBar ) {

          }

  ngOnInit() {
    this.user = this.userService.user;
    this.selectedRegionObject = this.userService.getSelectedRegionObject(this.data.regionName);
    this.fetchInputs();
  }

  fetchInputs(){
    let _self = this;
    this.serviceMatrix.fetchInputs(this.selectedRegionObject.regionId, this.data.taskId ).subscribe(
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
    this.serviceMatrix.selectInput(this.selectedRegionObject.regionId, this.data.taskId,this.selectedRow.id).subscribe(
    data => {
      this.successMessage = "Input value approved."
    },
    err => {
      this.errorMessage = "Error approving input value. Please try again later."
    },
    () => {

    });
    this.onClose();
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
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
  let config = new MatSnackBarConfig();
   config.verticalPosition = 'bottom';
   config.horizontalPosition = 'right';
   config.duration = 2000;
    this.snackBar.open(message, action, config);
  }

}
