import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from 'src/app/_services';
import { useAnimation } from '@angular/animations';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-labor-class',
  templateUrl: './labor-class.component.html',
  styleUrls: ['./labor-class.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*' })),
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
  taskCatalog: [];
  // serviceNames = new Set();
  // programs = new Set();
  // subprograms = new Set();
  // taskcategories = new Set();
  // tasks: Object[];
  filteredtasks: Object[];

  servicename: string;
  program: string;
  subprogram: string;
  taskcategory: string;
  taskid: string;
  taskhours: number = 0;
  fundingsource: string;
  feedback: string = "";
  selectedIndex: number = 1;

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(private http: HttpClient, private router: Router, private serviceMatrix: ServiceMatrixService,
    private userService: UserService, private route: ActivatedRoute, private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedRegionId = params['regionId'];
      this.customInit(this.selectedRegionId);
      this.loadTaskCatalog();
    });
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );
  }

  loadTaskCatalog() {
    this.taskCatalog = JSON.parse(localStorage.getItem('csServiceMatrix'));
    if (this.taskCatalog == null || this.taskCatalog.length <= 0) {
      this.serviceMatrix.getCsMatrixData()
        .subscribe(res => {
          this.taskCatalog = res as [];
          // this.taskCatalog.forEach(e => this.serviceNames.add(e["serviceName"]));
          localStorage.setItem('csServiceMatrix', JSON.stringify(res as []));
        });
    } 
    // else {
    //   this.taskCatalog.forEach(e => this.serviceNames.add(e["serviceName"]));
    // }
  }

  // private _filter(value: string) {
  //   const filterValue = value.toLowerCase();
  //   return this.tasks.filter(e => e['name'].toLowerCase().includes(filterValue));
  // }

  // filterServices() {
  //   let fltr = this.taskCatalog.filter(e => e["serviceName"] == this.servicename);
  //   this.programs = new Set();
  //   this.tasks = [];
  //   this.taskid = "";
  //   fltr.forEach(e => {
  //     this.programs.add(e["program"]);
  //     this.tasks.push({ "id": e["taskId"], "name": e["taskName"] });
  //   });
  // }

  // filterPrograms() {
  //   let fltr = this.taskCatalog.filter(e => e["program"] == this.program);
  //   this.subprograms = new Set();
  //   this.tasks = [];
  //   this.taskid = "";
  //   fltr.forEach(e => {
  //     this.subprograms.add(e["subProgram"]);
  //     this.tasks.push({ "id": e["taskId"], "name": e["taskName"] });
  //   });
  // }

  // filterSubPrograms() {
  //   let fltr = this.taskCatalog.filter(e => e["subProgram"] == this.subprogram);
  //   this.taskcategories = new Set();
  //   this.tasks = [];
  //   this.taskid = "";
  //   fltr.forEach(e => {
  //     this.taskcategories.add(e["taskCategory"]);
  //     this.tasks.push({ "id": e["taskId"], "name": e["taskName"] });
  //   });
  // }

  // filterTaskCategories() {
  //   let fltr = this.taskCatalog.filter(e => e["taskCategory"] == this.taskcategory);
  //   this.tasks = [];
  //   this.taskid = "";
  //   fltr.forEach(e => this.tasks.push({ "id": e["taskId"], "name": e["taskName"] }));
  // }

  // filterTasks(searchVal) {
  //   this.filteredtasks = this._filter(searchVal);
  // }

  addTask() {
    var pid = this.expandedElement['positionId'];
    this.serviceMatrix.saveCsInput(this.selectedRegionId, this.user["id"], pid, this.taskid, this.taskhours, this.feedback)
      .subscribe(res => {
        this.snackBar.openSnackBar("Input saved successfully", 'Close', "green-snackbar");
        console.log(res);
        this.expandedElement['hoursEntered'] = this.expandedElement['hoursEntered'] + this.taskhours;
      });
  }

  updateHoursEntered(element, hours){
    element['hoursEntered'] = hours;
  }

  updateHoursEnteredFromAdd(element, hours){
    element['hoursEntered'] = element['hoursEntered'] + hours;
  }

  resetAddTaskForm() {
    this.servicename = "";
    this.program = "";
    this.subprogram = "";
    this.taskcategory = "";
    this.taskid = "";
    this.taskhours = 0;
    this.fundingsource = "";
    this.feedback = "";
  }

  customInit(regionId) {
    this.user = this.userService.user;
    this.regionList = this.user['userRegionMappingsById'];
    this.selectedRegionObj = this.regionList.find(e => e["regionId"] == regionId);
    if (this.user != null) {
      var result = [];
      this.serviceMatrix.getLaborMappingsData(this.selectedRegionId, this.user["id"]).subscribe(res => {
        result = res as Object[];
        // result.forEach(element => {
        //   var inputHours = 0;
        //   element["csUserLaborClassInputs"].forEach(e => {
        //     inputHours = inputHours + e["inputHours"];
        //   });
        //   element["inputHours"] = inputHours;
        // });
        this.setDatasource(this.selectedRegionId, result);
      });
    }
  }

  chooseRegion(regionId: number) {
    this.router.navigate(["currentState", regionId]);
  }

  setDatasource(regionId, userLsMappingByRegion) {
    this.dataSource.data = [];
    this.displayedColumns = ["expansion", "positionId", "laborClassName", "hours", "inputHours", "utilization"];
    this.dataSource.data = userLsMappingByRegion as Object[];
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
  }

  backToLogin() {
    this.router.navigate(["login"]);
  }

  showMatrix(row) {
    this.router.navigate(['csLaborHours', this.selectedRegionId, row.laborClassName]);
  }

  expandRow(element) {
    this.resetAddTaskForm();
    this.expandedElement = this.expandedElement === element ? null : element;
  }

}
