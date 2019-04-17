
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
    myInput:'', inputCount: '', feedbackReceived: ''//, topFilter: false
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
      this.displayedColumns = ["viewTask", "taskId", "serviceName", "program",
      "subProgram", "taskCategory", "taskName", "myInput",  "statusCode", "inputCount"];
      this.displayedFilterColumns = [];
      this.displayedColumns.forEach(e => {
        this.displayedFilterColumns.push(e + '-filter');
      });
      if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']){
        this.displayedColumns.push("feedbackReceived");
        this.displayedFilterColumns.push('feedbackReceived-filter');
      }
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
           this.paginator.pageSize = this.serviceMatrix.filterStore.pageSize;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.applyAllFilters(this.globalFilter, this.filteredValues);
        });
    }

    public getRegionDetails  (user: Object) {
      this.regionList =  user['userRegionMappingsById'];
    }

    applyAllFilters(gFilter, fValues){
      this.applyFilter(gFilter);
      this.applyColumnFilter(fValues.taskId, 'taskId');
      this.applyColumnFilter(fValues.serviceName, 'serviceName');
      this.applyColumnFilter(fValues.program, 'program');
      this.applyColumnFilter(fValues.subProgram, 'subProgram');
      this.applyColumnFilter(fValues.taskCategory, 'taskCategory');
      this.applyColumnFilter(fValues.taskName, 'taskName');
      this.applyColumnFilter(fValues.myInput, 'myInput');
      this.applyColumnFilter(fValues.statusCode, 'statusCode');
      this.applyColumnFilter(fValues.inputCount, 'inputReceived');
      this.applyColumnFilter(fValues.feedbackReceived, 'feedbackReceived');
    }

    clearAllFilters(){
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 50;
      this.dataSource.paginator = this.paginator;
      this.globalFilter = '';
      this.filteredValues = { taskId:'', serviceName:'', program:'',
        subProgram:'', taskCategory: '', taskName : '', statusCode: '',
        myInput:'', inputCount: '',
        feedbackReceived:''
      };
      this.serviceMatrix.filterStore.pageIndex = 0;
      this.serviceMatrix.filterStore.globalFilter = '';
      this.serviceMatrix.filterStore.columnFilter = undefined;
      this.serviceMatrix.filterStore.selectedSubProgTasks = [];
      this.serviceMatrix.filterStore.pageSize = 50;
      this.applyAllFilters(this.globalFilter, this.filteredValues);
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
        let fbReceivedFound = data.feedbackReceived.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let taskDescFound = data.taskDesc.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        let sgFound = data.serviceGlossary.toString().trim().toLowerCase().indexOf(this.globalFilter.toString().toLowerCase()) !== -1;
        globalMatch = taskIdFound || serviceNameFound || programFound || subProgramFound || taskCategoryFound || taskNameFound || statusFound || inputFound || countFound || fbReceivedFound || taskDescFound || sgFound;
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
      let fbReceivedFound = data.feedbackReceived.toString().trim().toLowerCase().indexOf(searchString.feedbackReceived.toString().toLowerCase()) !== -1;
      return taskIdFound && serviceNameFound && programFound && subProgramFound && taskCategoryFound && taskNameFound && statusFound && inputFound && countFound && fbReceivedFound;
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
      this.storeFilterValues(this.paginator.pageIndex, this.paginator.pageSize);
      this.router.navigate([this.selectedRegion, "task", row.taskId ]);
      //var tasks = this.dataSource.data.filter(e => e['program'] == row.program);
      var tasks = this.dataSource.filteredData;
      this.serviceMatrix.filterStore.selectedSubProgTasks = [];
      if(tasks.length > 1){
        for(var i=0; i<tasks.length; i++){
          var sspt = tasks[i];
          if(i==0){
            sspt["prevTaskId"] = tasks[tasks.length-1]['taskId'];
            sspt["nextTaskId"] = tasks[i+1]['taskId'];
          } else if (i == tasks.length-1) {
            sspt["prevTaskId"] = tasks[i-1]['taskId'];
            sspt["nextTaskId"] = tasks[0]['taskId'];
          } else {
            sspt["prevTaskId"] = tasks[i-1]['taskId'];
            sspt["nextTaskId"] = tasks[i+1]['taskId'];
          }
          sspt["index"]= i+1;
          this.serviceMatrix.filterStore.selectedSubProgTasks.push(sspt);
        }
      }
    }

    chooseRegion(region: string){
      this.router.navigate(["service", region]);
    }

    backToLogin(){
      this.serviceMatrix.logout(this.userService.user['id']);

    this.serviceMatrix.filterStore.pageIndex = 0;
    this.serviceMatrix.filterStore.globalFilter = '';
    this.serviceMatrix.filterStore.columnFilter = undefined;
    this.serviceMatrix.filterStore.pageSize = 50;
    this.serviceMatrix.filterStore.selectedSubProgTasks = [];
      this.router.navigate(["login"]);
    }

    storeFilterValues(pageIndex: number, pageSize :number){
      this.serviceMatrix.filterStore.pageIndex = pageIndex;
      this.serviceMatrix.filterStore.pageSize = pageSize;
      this.serviceMatrix.filterStore.globalFilter = this.globalFilter;
      this.serviceMatrix.filterStore.columnFilter = this.filteredValues;
    }
}
