
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ServiceMatrixService }  from '../service-matrix.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { AuthenticationService, UserService } from 'src/app/_services';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-matrix-details',
  templateUrl: './matrix-details.component.html',
  styleUrls: ['./matrix-details.component.css']
})
export class MatrixDetailsComponent implements OnInit, AfterViewInit{
  dataSource = new MatTableDataSource<Object>();
  searchInput: string;
  user:Object;
  starColor : string = "primary";
  displayedColumns: string[] = ["taskId", "serviceName", "program",
   "subProgram", "taskCategory", "taskName"];

  admin:string[] = [ "input", "approved", "status", "count"];
  resp:string[] = [ "input", "approved"];

  globalFilter = '';
  regionList;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private router: Router, private serviceMatrix :ServiceMatrixService,
  private userService:UserService) {

  }

  ngOnInit() {
    this.getMatrixDetails();
    this.user = this.userService.user;
    if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
      this.displayedColumns.push( "input", "approved", "status", "count");
    } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
      this.displayedColumns.push( "input", "approved");
    }
    this.getRegionDetails();
  };

    public getMatrixDetails = () => {

        this.serviceMatrix.getData()
        .subscribe(res => {
            this.dataSource.data = res as Object[];
        });

    }

    public getRegionDetails = () => {
      this.serviceMatrix.getRegionDetails().
      subscribe(
        res=> {
          this.regionList = res;
        }
      );
    }

    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
    //  this.globalFilter = filterValue;
       this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    showTask(row) {
      console.log(row);
      this.router.navigate(["task", "123"]);
    }

    chooseRegion(region: string){
      alert(region);
      this.router.navigate(["service"]);
    }

    backToLogin(){
      this.router.navigate(["login"]);
    }
}
