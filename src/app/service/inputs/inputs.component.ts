import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { UserService } from 'src/app/_services';

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
  constructor(private serviceMatrix : ServiceMatrixService,
              public dialogRef : MatDialogRef<InputsComponent>,
              private userService:UserService,
            @Inject(MAT_DIALOG_DATA) public data: any ) { }

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

    });
  }

  approveResponse(){
    this.serviceMatrix.selectedRowIndex = this.selectedRowIndex;
    let _self = this;
    this.serviceMatrix.selectInput(this.selectedRegionObject.regionId, this.data.taskId,this.selectedRow.id).subscribe(
    data => {
    },
    err => {

    },
    () => {

    });
    this.onClose();
  }

  provideYourInput() {
    this.onClose();
  }

  highlight(row){
    console.log(`Selected row is ${row}`);
    console.log(`Number  is ${row.number}`);
    var myJSON = JSON.stringify(row);
    console.log(`converted json is ${myJSON}`);
    this.selectedRowIndex = row.id;
    this.selectedRow = row;
  }

  onClose() {
    this.dialogRef.close();
  }

}
