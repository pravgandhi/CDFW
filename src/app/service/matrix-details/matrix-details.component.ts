
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
export class MatrixDetailsComponent implements OnInit{
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
      this.displayedColumns.forEach(e => {
      this.displayedFilterColumns.push(e + '-filter');
       });
      this.getMatrixDetails(this.userService.user['id']);
      this.getRegionDetails(this.user);
      this.globalFilter = this.serviceMatrix.filterStore.globalFilter;
      if(this.serviceMatrix.filterStore.columnFilter != undefined){
        this.filteredValues = this.serviceMatrix.filterStore.columnFilter;
      }
    }

    public getMatrixDetails = (userId:string ) => {
        this.serviceMatrix.getData(this.selectedRegion, userId)
        .subscribe(res => {
          this.dataSource.data = res as Object[];
          this.dataSource.data.forEach(e => {
            e["statusCode"] = e["taskStatus"];
           })
           this.paginator.pageIndex = this.serviceMatrix.filterStore.pageIndex;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.applyFilters();
        });
    }

    public getRegionDetails  (user: Object) {
      this.regionList =  user['userRegionMappingsById'];
    }

    applyFilters(){
      this.applyFilter(this.globalFilter);
      this.applyColumnFilter(this.filteredValues.taskId, 'taskId');
      this.applyColumnFilter(this.filteredValues.serviceName, 'serviceName');
      this.applyColumnFilter(this.filteredValues.program, 'program');
      this.applyColumnFilter(this.filteredValues.subProgram, 'subProgram');
      this.applyColumnFilter(this.filteredValues.taskCategory, 'taskCategory');
      this.applyColumnFilter(this.filteredValues.taskName, 'taskName');
      this.applyColumnFilter(this.filteredValues.myInput, 'myInput');
      this.applyColumnFilter(this.filteredValues.statusCode, 'statusCode');      
      this.applyColumnFilter(this.filteredValues.inputCount, 'inputReceived');
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
        let countFound = data.inputReceived.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
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
      let countFound = data.inputReceived.toString().trim().toLowerCase().indexOf(searchString.inputCount.toString().toLowerCase()) !== -1;
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
      this.storeFilterValues(this.paginator.pageIndex);
      this.router.navigate([this.selectedRegion, "task", row.taskId ]);
      var tasks = this.dataSource.data.filter(e => e['subProgram'] == row.subProgram);
      this.serviceMatrix.filterStore.selectedSubProgTasks = tasks;
    }

    chooseRegion(region: string){
      this.router.navigate(["service", region]);
    }

    backToLogin(){
      this.serviceMatrix.logout(this.userService.user['id']);
      
    this.serviceMatrix.filterStore.pageIndex = 0;
    this.serviceMatrix.filterStore.globalFilter = '';
    this.serviceMatrix.filterStore.columnFilter = undefined;
    this.serviceMatrix.filterStore.selectedSubProgTasks = [];
      this.router.navigate(["login"]);
    }

    storeFilterValues(pageIndex: number){
      this.serviceMatrix.filterStore.pageIndex = pageIndex;
      this.serviceMatrix.filterStore.globalFilter = this.globalFilter;
      this.serviceMatrix.filterStore.columnFilter = this.filteredValues;
    }
}
