import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-labor-hour-details',
  templateUrl: './labor-hour-details.component.html',
  styleUrls: ['./labor-hour-details.component.css']
})
export class LaborHourDetailsComponent implements OnInit {
  user: Object;
  selectedRegionId: number;
  dataSource = new MatTableDataSource<Object>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ["taskId", "serviceName", "program",
  "subProgram", "taskCategory", "taskName"];

  constructor( private serviceMatrix: ServiceMatrixService, private userService:UserService,
  private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedRegionId = params['regionId'];
      this.customInit(params);
    });
  }

  customInit(params){
    this.user = this.userService.user;
    this.serviceMatrix.getCsMatrixData()
    .subscribe(res => {
      this.setDataSource(res as Object[])
    });
  }


  setDataSource(res:Object[]){
    this.dataSource.data = res;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  backToLogin(){
    this.serviceMatrix.logout(this.userService.user['id']);
    this.router.navigate(["login"]);
  }

  backToLandingPage(){
    this.router.navigate(['currentState', this.selectedRegionId]);
  }

}
