import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserService } from 'src/app/_services';
import { useAnimation } from '@angular/animations';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-labor-class',
  templateUrl: './labor-class.component.html',
  styleUrls: ['./labor-class.component.css']
})
export class LaborClassComponent implements OnInit {

  dataSource = new MatTableDataSource<Object>();
  user: any = null;
  displayedColumns: string[] = [];
  selectedRegionId: number;
  selectedRegionObj: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  regionList: [];

  constructor(private http: HttpClient, private router: Router, private serviceMatrix: ServiceMatrixService,
    private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedRegionId = params['regionId'];
      this.customInit(this.selectedRegionId);
    });
  }

  customInit(regionId) {
    this.user = this.userService.user;
    this.setRegionDetails(this.user);
    if (this.user != null && this.user["laborClassMappingsById"].length > 0) {
      this.setDatasource(this.selectedRegionId);
    }
  }

  setRegionDetails(user: Object) {
    this.regionList = user['userRegionMappingsById'];
  }

  chooseRegion(regionId: number){
     this.router.navigate(["currentState", regionId]);
  }

  setDatasource(regionId){
    this.dataSource.data = [];
    this.selectedRegionObj = this.regionList.find(e => e["regionId"] == regionId);
    this.displayedColumns = ["laborClassName", "hours"];
    var userLsMappings = this.user["laborClassMappingsById"];
    var userLsMappingByRegion = userLsMappings.filter(e => e.regionId == regionId);
    userLsMappingByRegion.forEach(element => {
      this.dataSource.data.push(element["laborClass"]);
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  backToLogin() {
    this.router.navigate(["login"]);
  }

  showMatrix(row) {
    this.router.navigate(['csLaborHours', this.selectedRegionId]);
  }

}
