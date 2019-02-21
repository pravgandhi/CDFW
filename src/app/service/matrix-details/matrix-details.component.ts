
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
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
  selectedRegion:string;
  regionList;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient, private router: Router, private serviceMatrix :ServiceMatrixService,
  private userService:UserService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.selectedRegion = params['regionId'];
      this.customInit(params);
    });
  };

    customInit(params){
      alert(params['regionId']);
      this.user = this.userService.user;
      if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
         this.displayedColumns.push( "input", "approved", "status", "count");
       } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
         this.displayedColumns.push( "input", "approved");
       }
       this.getMatrixDetails(this.userService.user['userName']);
       this.getRegionDetails(this.user);
    }

    public getMatrixDetails = (userName:string, ) => {
        this.serviceMatrix.getData(this.selectedRegion)
        .subscribe(res => {
            this.dataSource.data = res as Object[];
        });
    }

    public getRegionDetails  (user: Object) {
      this.regionList =  user['userRegionMappingsById'];
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
      debugger;
      alert(row);
      this.router.navigate([this.selectedRegion, "task", row.taskId ]);
    }

    chooseRegion(region: string){
      this.router.navigate(["service", region]);
    }

    backToLogin(){
      this.router.navigate(["login"]);
    }

    initialiseState(){
      alert('Inside Initialize');
    };
}
