import { Component, OnInit } from '@angular/core';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-labor-hour-details',
  templateUrl: './labor-hour-details.component.html',
  styleUrls: ['./labor-hour-details.component.css']
})
export class LaborHourDetailsComponent implements OnInit {
  dataSource = new MatTableDataSource<Object>();
  displayedColumns = ["taskId", "serviceName", "program",
  "subProgram", "taskCategory", "taskName"];

  constructor( private serviceMatrix: ServiceMatrixService) { }

  ngOnInit() {
    this.customInit();
  }

  customInit(){
    this.serviceMatrix.getCsMatrixData()
    .subscribe(res => {
      debugger;
      console.log(res);
      this.dataSource.data = res as Object[];
    });
  }
}
