import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { UserService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/components/common/selectitem';


@Component({
  selector: 'app-labor-hour-details',
  templateUrl: './labor-hour-details.component.html',
  styleUrls: ['./labor-hour-details.component.css']
})
export class LaborHourDetailsComponent implements OnInit {
  user: Object;
  selectedLaborClassName: string;
  selectedRegionId: number;
  selectedRegionObj: Object;
  selectedTask:Object;
  assignedTasks: Object[] = new Array();
  taskCatalog: Object[];
  dataSource = new MatTableDataSource<Object>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  regionList: [];
  displayedColumns = ["taskId", "serviceName", "program",
  "subProgram", "taskCategory", "taskName", "hoursSpent"];

   csHoursData: any = [];
   data: any = [];

   fundingSources: SelectItem[];


  constructor( private serviceMatrix: ServiceMatrixService, private userService:UserService,
  private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedRegionId = params['regionId'];
      this.selectedLaborClassName = params['laborClassName'];
      this.customInit(params);
    });
  }


  addRow(row:any) {
    this.csHoursData = [...this.csHoursData];
    this.csHoursData.push({taskId: row.taskId, taskName: row.taskName, isEditable:false});
  }

  customInit(params){
    this.user = this.userService.user;
    this.setRegionDetails(this.user);
    this.selectedRegionObj = this.regionList.find(e => e["regionId"] == params['regionId']);
    if(localStorage.getItem('csServiceMatrix') == null || localStorage.getItem('csServiceMatrix') == undefined){
      this.serviceMatrix.getCsMatrixData()
      .subscribe(res => {
        this.taskCatalog = res as Object[];
        this.setDataSource(res as Object[]);
        localStorage.setItem('csServiceMatrix', JSON.stringify(res as Object[]));
      });
    } else {
      this.setDataSource(JSON.parse(localStorage.getItem('csServiceMatrix')) as Object[]);
    }

    this.fundingSources = [
    {label: 'FS1', value: 'Funding Source 1'},
    {label: 'FS2', value: 'Funding Source 2'},
    {label: 'FS3', value: 'Funding Source 3'},
    {label: 'FS4', value: 'Funding Source 4'},
    {label: 'FS5', value: 'Funding Source 5'},
    {label: 'FS6', value: 'Funding Source 6'},
  ];
  }

  setRegionDetails(user: Object) {
    this.regionList = user['userRegionMappingsById'];
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

  assignHours(row:any){
    this.selectedTask = row;
    this.assignedTasks.push(row);
    this.addRow(row);
  }

  onRowEditInit(csHoursData: any) {
    alert('Inside edit' + csHoursData.taskId);
  }

onRowEditSave(csHoursData: any) {
    alert('Inside Save');
}

onRowEditCancel(csHoursData: any, index: number) {
    alert('Inside Cancel');
}

}
