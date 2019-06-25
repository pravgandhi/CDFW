import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InputsComponent } from '../inputs/inputs.component';

import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { UserService } from 'src/app/_services';
import { FeedbackComponent } from '../feedback/feedback.component';



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
  dataSourceJustification = new MatTableDataSource<Object>();
  displayedColumns: string[] = ["title", "role", "time"];
  displayedColumnsJustification: string[] = ["categoryName"];
  selectedRegion:string;
  selectedRegionId:number;
  selectedTask:string;
  multiplier: number= 0;
  taskfeedback: string;
  saveRespInputDisabled : boolean = false;
  approved: boolean = false;
  errorMessage: string = null;
  successMessage: string = null;
  approvedMsgResp: string = null;
  approvedMsgLead: string = null;
  subProgramTasks: any[] = [];
  changeInputDetection: boolean = false;

  constructor(private route: ActivatedRoute, private serviceMatrix : ServiceMatrixService,
    private router: Router, private dialog: MatDialog,
    private userService:UserService, private snackBar: MatSnackBarComponent
  ) {

     }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedRegionId = params['regionId'];
      this.customInit(params['regionName'], params['taskId']);
    });
  }

  ngOnChanges(){

  }

  customInit(regionName:string, taskId: string){
    this.user = this.userService.user;
    this.getTaskInfo1(regionName, taskId);
    this.userRole = this.userService.userRole;
    this.selectedRegion = regionName;
    this.inpuTaskId = taskId;

    if (this.serviceMatrix.filterStore.selectedSubProgTasks != undefined) {
      this.subProgramTasks = this.serviceMatrix.filterStore.selectedSubProgTasks;
    }
    this.saveFilter(this.serviceMatrix.filterStore);
  }

  saveFilter(fstore){
    var cf = '{"taskId":"","serviceName":"","program":"","subProgram":"","taskCategory":"","taskName":"","statusCode":"","myInput":"","inputCount":"","feedbackReceived":"","toBeEnteredBy":"","inputReceived":""}';
    if(fstore.pageIndex !=0 || fstore.globalFilter != ''
    || fstore.pageSize != 50 || (fstore.columnFilter != undefined && JSON.stringify(fstore.columnFilter) != cf)){
      if(this.user['filter'] != fstore.toString()){
        this.serviceMatrix.saveFilter(this.user['id'], fstore.toString()).subscribe(data => {
          let user = JSON.parse(localStorage.getItem('currentUser'));
          user['filter'] = fstore.toString();
          localStorage.setItem('currentUser', JSON.stringify(user));
        });
      }
    }
  }


  public getTaskInfo1 = (selectedRegion, taskId) => {
        let _self = this;
          this.serviceMatrix.getTaskDetail1(selectedRegion, taskId).subscribe(
        data => {
          _self.task = data;
          _self.dataSource.data = data['laborClassesByTaskId'];
          _self.dataSourceJustification.data = data['jrsdctnCtgriesByTaskId'];
          let inputs = data['missionUserInputsByTaskId'];
          _self.serviceMatrix.inputDataStore = inputs;
          _self.approved = false;
          _self.multiplier = 0;
          _self.taskfeedback = "";
          _self.saveRespInputDisabled = false;
           if('Validated' === _self.task['taskStatus']) {
             _self.approved = true;
             if(_self.userService.userRole === 'm_resp'){
               _self.saveRespInputDisabled = true;
               _self.approvedMsgResp = "The multiplier input for this task has been validated. You may submit additional suggestions to your designated Region lead by reaching out directly.";
             } else {
               _self.approvedMsgLead = "The multiplier input for this task has been validated.";
             }
             let approvedInput =  inputs.filter(function(input) {
               return input['regionByRegionId']['regionName'] == selectedRegion && input['sttsId'] == "A";
              });

              if (approvedInput.length == 1) {
                _self.multiplier = approvedInput[0].inputValue;
              }
           } else  {
             let myInput = this.filterInputsByUserAndRegion(inputs, _self.user['id'], selectedRegion);
              if (myInput.length == 1) {
                _self.multiplier = myInput[0].inputValue;
              }
           }

           let loggedinUserInput = this.filterInputsByUserAndRegion(inputs, _self.user['id'], selectedRegion);
           if (loggedinUserInput.length == 1) {
             _self.taskfeedback = loggedinUserInput[0].feedback;
           }

           if(this.subProgramTasks.length > 1){
             var fltr = this.subProgramTasks.filter(e => e['taskId'] == _self.task['taskId']);
             if(fltr.length > 0){
              _self.task["nextTaskId"] = fltr[0].nextTaskId;
              _self.task["prevTaskId"] = fltr[0].prevTaskId;
              _self.task["index"] = fltr[0].index;
            }
           }

        },
        err => {
          this.snackBar.openSnackBar( "Error fetching task details. Please try again later", 'Close', "red-snackbar");
        },
        () => {

        }
      );
  }

  goToTask(taskId){
    this.router.navigate([this.selectedRegion, this.selectedRegionId, "task", taskId ]);
  }

  filterInputsByUserAndRegion(inputs:any, userId:number, regionName:string){
    let myInputs = inputs.filter(function(input) {
      return input.id == userId && input['regionByRegionId']['regionName'] == regionName;
     });
     return myInputs;
  }


  saveResponse(){
    let status = 'N';
    if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
        status = 'A';
        if (this.task['missionUserInputsByTaskId'] != undefined && this.task['missionUserInputsByTaskId'].length > 0)  {
          var missionUserInputsByTaskIdByRegion = this.task['missionUserInputsByTaskId'].filter(e => e.regionByRegionId.regionName == this.selectedRegion);
          if(missionUserInputsByTaskIdByRegion.length > 0) {
            const dialogRef = this.dialog.open(SaveResponseConfirmDialog, {
              width: '500px',
              data: {confirm: 'No'}
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result.confirm == 'Yes'){
                this.saveUserInput(status);
              }
            });
          } else {
            this.saveUserInput(status);
          }
        } else {
          this.saveUserInput(status);
        }
     } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
       status = 'P';
       this.saveUserInput(status);
     }
  }

  onApproval(task, status){
    let _self = this;
    _self.approved = true;
    _self.approvedMsgLead = "The multiplier input for this task has been validated.";
  }

  saveUserInput(stats){
    this.serviceMatrix.saveUserInput(this.user['id'], this.selectedRegion, this.inpuTaskId, this.multiplier, this.taskfeedback).subscribe(res => {
        this.customInit(this.selectedRegion , this.inpuTaskId);
        this.changeInputDetection = !this.changeInputDetection;
        this.snackBar.openSnackBar( "Input saved successfully", 'Close', "green-snackbar");
      },
      err => {
        this.snackBar.openSnackBar( "Error saving input value", 'Close', "red-snackbar");
      }
    );
  }

  goBackToMatrix(){
    this.router.navigate(["service", this.selectedRegion, this.selectedRegionId]);
  }

  viewInputs(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.maxHeight = '400px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        regionName: this.selectedRegion,
        userId: this.user['id'],
        taskId : this.task['taskId']
    };
    const inputDialogRef = this.dialog.open(InputsComponent, dialogConfig);

    inputDialogRef.afterClosed().subscribe(data => {
      if(data != undefined) {
        this.customInit(data.regionName , data.taskId);
      }
    });
  }

  viewFeedbacks(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.maxHeight = '400px';
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        regionName: this.selectedRegion,
        userId: this.user['id'],
        taskId : this.task['taskId']
    };
    const inputDialogRef = this.dialog.open(FeedbackComponent, dialogConfig);

    inputDialogRef.afterClosed().subscribe(data => {});
  }

  provideYourInputs(){
    this.router.navigate(['task',this.inpuTaskId]);
  }

  backToRegion(){
    this.router.navigate(["region"]);
  }

  backToLogin(){
    this.serviceMatrix.logout(this.userService.user['id']);
    this.serviceMatrix.filterStore.pageIndex = 0;
    this.serviceMatrix.filterStore.pageSize = 50;
    this.serviceMatrix.filterStore.globalFilter = '';
    this.serviceMatrix.filterStore.columnFilter = undefined;
    this.serviceMatrix.filterStore.selectedSubProgTasks = [];
    this.router.navigate(["login"]);
  }

/*  openSnackBar(message: string, action: string) {
  let config = new MatSnackBarConfig();
   config.verticalPosition = 'bottom';
   config.horizontalPosition = 'right';
   config.duration = 2000;
    this.snackBar.open(message, action, config);
  } */

}

@Component({
  selector: 'save-input-confirm-dialog',
  templateUrl: 'save-input-confirm-dialog.html',
})
export class SaveResponseConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<SaveResponseConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  closeDialog(confirm): void{
    this.dialogRef.close({'confirm': confirm});
  }

}
