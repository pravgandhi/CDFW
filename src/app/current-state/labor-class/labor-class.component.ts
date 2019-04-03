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
  selectedRegion: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private http: HttpClient, private router: Router, private serviceMatrix: ServiceMatrixService,
    private userService:UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
    this.selectedRegion = params['regionId'];
      this.customInit(params);
    });
  }


  customInit(params){
    this.user = this.userService.user;
    if(this.user != null && this.user["laborClassMappingsById"].length > 0){
      this.displayedColumns = ["laborClassName", "hours"];
      var userLsMappings = this.user["laborClassMappingsById"];
      userLsMappings.forEach(element => {
        this.dataSource.data.push(element["csLaborClassbyLaborClassId"]);
      });
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  backToLogin() {
    this.router.navigate(["login"]);
  }


  showMatrix(row) {
    this.router.navigate(['cslaborhours']);
  }

}
