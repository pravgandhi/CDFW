
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ServiceMatrixService }  from '../service-matrix.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-matrix-details',
  templateUrl: './matrix-details.component.html',
  styleUrls: ['./matrix-details.component.css']
})
export class MatrixDetailsComponent implements OnInit {
  searchInput: string;
  displayedColumns: string[] = ["regionCode", "serviceName", "program", "subProgram", "categoryName", "taskName"];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private router: Router, private serviceMatrix :ServiceMatrixService) {

  }

  ngOnInit() {
    this.serviceMatrix.getServiceMatrix1();
      
    };

    applyFilter(filterValue: string) {
      //  this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    showTask(row) {
      console.log(row);
      this.router.navigate(["task", "123"]);
    }
}
