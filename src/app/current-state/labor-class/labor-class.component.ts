import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from 'src/app/_services';
import { useAnimation } from '@angular/animations';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-labor-class',
  templateUrl: './labor-class.component.html',
  styleUrls: ['./labor-class.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class LaborClassComponent implements OnInit {

  dataSource = new MatTableDataSource<Object>();
  expandedElement: Object | null;
  user: any = null;
  displayedColumns: string[] = [];
  selectedRegionId: number;
  selectedRegionObj: Object;
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
    this.regionList = this.user['userRegionMappingsById'];
    this.selectedRegionObj = this.regionList.find(e => e["regionId"] == regionId);
    if (this.user != null) {
      this.serviceMatrix.getLaborMappingsData(this.selectedRegionId, this.user["id"]).subscribe(res => {
        this.setDatasource(this.selectedRegionId, res);
      });
    }
  }

  chooseRegion(regionId: number){
     this.router.navigate(["currentState", regionId]);
  }

  setDatasource(regionId, userLsMappingByRegion){
    this.dataSource.data = [];
    this.displayedColumns = ["laborClassName", "hours", "inputHours"];
    this.dataSource.data = userLsMappingByRegion as Object[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  backToLogin() {
    this.router.navigate(["login"]);
  }

  showMatrix(row) {
    this.router.navigate(['csLaborHours', this.selectedRegionId, row.laborClassName]);
  }

  expandRow(element) {
    this.expandedElement = this.expandedElement === element ? null : element;
    return false;
  }

}
