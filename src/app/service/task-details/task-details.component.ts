import { Component, OnInit, Input } from '@angular/core';
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
  userRole: string;
  task : Object;
  dataSource = new MatTableDataSource<Object>();
  displayedColumns: string[] = ["title", "role", "time"];
  selectedRegion:string;
  selectedRegionId:string;
  selectedTask:string;
  multiplier: number= 0;
  saveRespInputDisabled : boolean = false;

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
    this.user = this.userService.user;
    this.getTaskInfo1(this.selectedRegion, this.inpuTaskId);
    this.userRole = this.userService.userRole;
    // this.setInputDisabledValue();
  }

  // setInputDisabledValue(){
  //   if('A' === this.task.statusBySttsId.sttsId && 'm_resp' === this.userRole )
  //       this.saveRespInputDisabled = true;
  // }

  public getTaskInfo1 = (selectedRegion, taskId) => {
        let _self = this;
        this.serviceMatrix.getTaskDetail1(selectedRegion, taskId).subscribe(
        data => {
          _self.task = data;
          _self.dataSource.data = data['laborClassesByTaskId'];
          let inputs = data['missionUserInputsByTaskId'];
          _self.serviceMatrix.inputDataStore = inputs;

           if('A' === this.task['statusBySttsId']['sttsId']) {
             let approvedInput =  inputs.filter(function(input) {
               if(_self.userService.userRole === 'm_resp'){
                 _self.saveRespInputDisabled = true;
               }
               return input.sttsId== 'A';
              });
              if (approvedInput.length == 1) {
                _self.multiplier = approvedInput[0].inputValue;
              }
           } else  {
             let myInput =  inputs.filter(function(input) {
               return input.id == _self.user['id'];
              });
              if (myInput.length == 1) {
                _self.multiplier = myInput[0].inputValue;
              }
           }
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
    this.serviceMatrix.saveUserInput(this.user['id'], this.selectedRegion, this.inpuTaskId, this.multiplier, status  ).
    subscribe(res => {
    });
  }

  goBackToMatrix(){
    this.router.navigate(["service", this.selectedRegion]);
  }

  viewInputs(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        regionName: this.selectedRegion,
        userId: this.user['id'],
        taskId : this.task['taskId'],
    };
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
