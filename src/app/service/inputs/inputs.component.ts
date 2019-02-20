import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.css']
})
export class InputsComponent implements OnInit  {

  selectedRowIndex: number = -1;
  inputDisplayedColumns: string[] = ["id", "value", "name"];
  constructor(private serviceMatrix : ServiceMatrixService,
              public dialogRef : MatDialogRef<InputsComponent> ) { }

  ngOnInit() {

  }



  approveResponse(){
    this.serviceMatrix.selectedRowIndex = this.selectedRowIndex;
    alert('save the selected value and mark others as rejected');
    this.onClose();
  }

  provideYourInput() {
    alert('Back to task Input Screen');
    this.onClose();
  }

  highlight(row){
    console.log(`Selected row is ${row}`);
    console.log(`Number  is ${row.number}`);
    var myJSON = JSON.stringify(row);
    console.log(`converted json is ${myJSON}`);
    this.selectedRowIndex = row.id;
  }

  onClose() {
    this.dialogRef.close();
  }

}
