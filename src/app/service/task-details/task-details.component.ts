import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InputsComponent } from '../inputs/inputs.component';

import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
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
  dataSourceJustification = new MatTableDataSource<Object>();
  displayedColumns: string[] = ["title", "role", "time"];
  displayedColumnsJustification: string[] = ["categoryName"];
  selectedRegion:string;
  selectedRegionId:string;
  selectedTask:string;
  multiplier: number= 0;
  saveRespInputDisabled : boolean = false;
  approved: boolean = false;
  errorMessage: string = null;
  successMessage: string = null;
  approvedMsgResp: string = null;
  approvedMsgLead: string = null;

  constructor(private route: ActivatedRoute, private serviceMatrix : ServiceMatrixService,
    private router: Router, private dialog: MatDialog,
    private userService:UserService, private snackBar: MatSnackBarComponent
  ) {

     }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.customInit(params['regionId'], params['taskId']);
    });
  }

  customInit(regionId:string,taskId: string){
    this.user = this.userService.user;
    this.getTaskInfo1(regionId, taskId);
    this.userRole = this.userService.userRole;
    this.selectedRegion = regionId;
    this.inpuTaskId = taskId;
  }


  public getTaskInfo1 = (selectedRegion, taskId) => {
        let _self = this;
          this.serviceMatrix.getTaskDetail1(selectedRegion, taskId).subscribe(
        data => {
          debugger;
          _self.task = data;
          _self.dataSource.data = data['laborClassesByTaskId'];
          _self.dataSourceJustification.data = data['jrsdctnCtgriesByTaskId'];
          let inputs = data['missionUserInputsByTaskId'];
          _self.serviceMatrix.inputDataStore = inputs;
           if('Validated' === _self.task['taskStatus']) {
             _self.approved = true;
             let approvedInput =  inputs.filter(function(input) {
               if(_self.userService.userRole === 'm_resp'){
                 _self.saveRespInputDisabled = true;
                 _self.approvedMsgResp = "The multiplier input for this task has been validated. You may submit additional suggestions to your designated Region lead by reaching out directly.";
               } else {
                 _self.approvedMsgLead = "The multiplier input for this task has been validated.";
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
          this.snackBar.openSnackBar( "Error fetching task details. Please try again later", 'Close', "red-snackbar");
        },
        () => {

        }
      );
  }

  saveResponse(){
    let status = 'N';
    if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
        status = 'A';
        if (this.task['missionUserInputsByTaskId'] != undefined && this.task['missionUserInputsByTaskId'].length > 0)  {
          const dialogRef = this.dialog.open(SaveResponseConfirmDialog, {
            width: '500px',
            data: {confirm: 'No'}
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed -->'+result.confirm);
            if (result.confirm == 'Yes'){
              this.saveUserInput(status);
            } else {
              this.viewInputs();
            }
          });
        } else {
          this.saveUserInput(status);
        }
     } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
       status = 'P';
       this.saveUserInput(status);
     }
  }

  saveUserInput(stats){
    this.serviceMatrix.saveUserInput(this.user['id'], this.selectedRegion, this.inpuTaskId, this.multiplier).subscribe(res => {
        this.snackBar.openSnackBar( "Input saved successfully", 'Close', "green-snackbar");
      },
      err => {
        this.snackBar.openSnackBar( "Error saving input value", 'Close', "red-snackbar");
      }
    );
  }

  goBackToMatrix(){
    this.router.navigate(["service", this.selectedRegion]);
  }

  viewInputs(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
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

  provideYourInputs(){
    this.router.navigate(['task',this.inpuTaskId]);
  }

  backToRegion(){
    this.router.navigate(["region"]);
  }

  backToLogin(){
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