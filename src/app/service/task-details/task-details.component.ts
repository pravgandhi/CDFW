import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { InputsComponent } from '../inputs/inputs.component';
import { UserService } from 'src/app/_services';


@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  inpuTaskId : string;
  user: Object;
  task : Object;
  dataSource = new MatTableDataSource<Object>();
  displayedColumns: string[] = ["title", "role", "time"];
  selectedRegion:string;
  selectedTask:string;
  multiplier: number;

  groups = [
   {
     "name": "pencils",
     "items": ["red pencil","blue pencil","yellow pencil"]
   },
   {
     "name": "rubbers",
     "items": ["big rubber","small rubber"]
   },
] ;

  constructor(private route: ActivatedRoute, private serviceMatrix : ServiceMatrixService,
    private router: Router, private dialog: MatDialog,
    private userService:UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.selectedRegion = params['regionId'];
      this.inpuTaskId = params['taskId'];
      this.customInit();
    });
  }

  customInit(){
    this.getTaskInfo1(this.selectedRegion, this.inpuTaskId);
    this.user = this.userService.user;
  }

  public getTaskInfo1 = (selectedRegion, taskId) => {
        this.serviceMatrix.getTaskDetail1(selectedRegion, taskId).subscribe(
        data => {
          this.task = data;
          this.dataSource.data = data['laborClassesByTaskId'];

        },
        err => {

        },
        () => {

        }
      );
  }

  saveResponse(){
    let status = 'N';
    if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
        status = 'A';
     } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
       status = 'P';
     }
    this.serviceMatrix.saveUserInput(this.user['userId'], this.selectedRegion, this.inpuTaskId, multiplier, status  ).
    subscribe(res => {
    });
  }

  goBackToMatrix(){
    this.router.navigate(["service", this.selectedRegion]);
  }

  viewInputs(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(InputsComponent, dialogConfig);
  }

  provideYourInputs(){
    this.router.navigate(['task',this.inpuTaskId]);
  }

  backToRegion(){
    this.router.navigate(["region"]);
  }

  backToLogin(){
    this.router.navigate(["login"]);
  }

}
