
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceMatrixService }  from '../service-matrix.service';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { AuthenticationService, UserService } from 'src/app/_services';
import { NgForm, FormControl } from '@angular/forms';

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
  displayedColumns: string[] = [];
  displayedFilterColumns: string[] = [];
  globalFilter = '';
  selectedRegion:string;
  regionList;
  filteredValues = { taskId:'', serviceName:'', program:'',
    subProgram:'', taskCategory: '', taskName : '', statusCode: '',
    myInput:'', inputCount: ''//, topFilter: false
  };

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

    this.dataSource.filterPredicate = this.customFilterPredicate();
  };

    customInit(params){
      this.user = this.userService.user;
      this.displayedColumns = ["taskId", "serviceName", "program",
      "subProgram", "taskCategory", "taskName", "myInput",  "statusCode", "inputCount"];
      this.displayedFilterColumns = [];
      //remove this block after confirmation about the display of columns for resp
      // if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
      //    this.displayedColumns.push( "input",  "status", "count");
      //  } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
      //    this.displayedColumns.push( "input",  "status", "count");
      //  }

       this.displayedColumns.forEach(e => {
        this.displayedFilterColumns.push(e + '-filter');
       });
       this.getMatrixDetails(this.userService.user['id']);
       this.getRegionDetails(this.user);
    }

    public getMatrixDetails = (userId:string ) => {
        this.serviceMatrix.getData(this.selectedRegion, userId)
        .subscribe(res => {
          console.log(res);
          this.dataSource.data = res as Object[];
          this.dataSource.data.forEach(e => {
            e["statusCode"] = e["taskStatus"];
           })
        });
    }

    public getRegionDetails  (user: Object) {
      this.regionList =  user['userRegionMappingsById'];
    }

    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }


  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {
      var globalMatch = !this.globalFilter;
      if (this.globalFilter) {
        let taskIdFound = data.taskId.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let serviceNameFound = data.serviceName.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let programFound = data.program.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let subProgramFound = data.subProgram.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let taskCategoryFound = data.taskCategory.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let taskNameFound = data.taskName.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let statusFound = data.taskStatus.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let inputFound = data.myInput.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let countFound = data.inputCount.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        globalMatch = taskIdFound || serviceNameFound || programFound || subProgramFound || taskCategoryFound || taskNameFound || statusFound || inputFound || countFound;
      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      let taskIdFound = data.taskId.toString().trim().toLowerCase().indexOf(searchString.taskId.toString().toLowerCase()) !== -1;
      let serviceNameFound = data.serviceName.toString().trim().toLowerCase().indexOf(searchString.serviceName.toString().toLowerCase()) !== -1;
      let programFound = data.program.toString().trim().toLowerCase().indexOf(searchString.program.toString().toLowerCase()) !== -1;
      let subProgramFound = data.subProgram.toString().trim().toLowerCase().indexOf(searchString.subProgram.toString().toLowerCase()) !== -1;
      let taskCategoryFound = data.taskCategory.toString().trim().toLowerCase().indexOf(searchString.taskCategory.toString().toLowerCase()) !== -1;
      let taskNameFound = data.taskName.toString().trim().toLowerCase().indexOf(searchString.taskName.toString().toLowerCase()) !== -1;
      let statusFound = data.taskStatus.toString().trim().toLowerCase().indexOf(searchString.statusCode.toString().toLowerCase()) !== -1;
      let inputFound = data.myInput.toString().trim().toLowerCase().indexOf(searchString.myInput.toString().toLowerCase()) !== -1;
      let countFound = data.inputCount.toString().trim().toLowerCase().indexOf(searchString.inputCount.toString().toLowerCase()) !== -1;
      return taskIdFound && serviceNameFound && programFound && subProgramFound && taskCategoryFound && taskNameFound && statusFound && inputFound && countFound;
    }
    return myFilterPredicate;
  }

    applyColumnFilter(filterValue: string, col: string) {
      this.filteredValues[col] = filterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    }

    applyFilter(filter) {
    //  this.globalFilter = filterValue;
      //  this.dataSource.filter = filterValue.trim().toLowerCase();

      this.globalFilter = filter;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    }

    showTask(row) {
      this.router.navigate([this.selectedRegion, "task", row.taskId ]);
    }

    chooseRegion(region: string){
      this.router.navigate(["service", region]);
    }

    backToLogin(){
      this.router.navigate(["login"]);
    }

}