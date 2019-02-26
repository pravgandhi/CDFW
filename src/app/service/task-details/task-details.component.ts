<<<<<<< HEAD
import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
=======
import { Component, OnInit, Input, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
>>>>>>> 54d405f42ed2190437586df706dbd6e5387657f8
import { InputsComponent } from '../inputs/inputs.component';
import { UserService } from 'src/app/_services';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';



@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit, AfterViewInit {

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
  errorMessage: string = null;
  successMessage: string = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private route: ActivatedRoute, private serviceMatrix : ServiceMatrixService,
    private router: Router, private dialog: MatDialog,
    private userService:UserService, private snackBar: MatSnackBarComponent
  ) {
        dialog.afterAllClosed.subscribe(data => this.customInit());
     }

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
    this.dataSource.data = [{
      title:'title1',
      role : 'role1',
      time : '1'
    }, {
      title:'title2',
      role : 'role2',
      time : '2'
    }, {
      title:'title3',
      role : 'role3',
      time : '3'
    },
    {
      title:'title4',
      role : 'role4',
      time : '4'
    }];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public getTaskInfo1 = (selectedRegion, taskId) => {
        let _self = this;
        this.serviceMatrix.getTaskDetail1(selectedRegion, taskId).subscribe(
        data => {
          _self.task = data;
          debugger;
        //  _self.dataSource.data = data['laborClassesByTaskId'];
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
          this.snackBar.openSnackBar( "Error fetching task details. Please try again later", 'Close', "red-snackbar");
        },
        () => {

        }
      );
  }

  saveResponse(){
  /*  let status = 'N';
    if('admin' === this.user['userRoleByRoleId']['roleName'] || 'm_lead' === this.user['userRoleByRoleId']['roleName']) {
        status = 'A';        
        const dialogRef = this.dialog.open(SaveResponseConfirmDialog, {
          width: '500px',
          data: {confirm: 'No'}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed -->'+result.confirm);
          if (result.confirm == 'Yes'){
            this.saveUserInput(status);
          }
        });

     } else if ('m_resp' === this.user['userRoleByRoleId']['roleName']) {
       status = 'P';
<<<<<<< HEAD
     }*/
    this.serviceMatrix.saveUserInput(this.user['id'], this.selectedRegion, this.inpuTaskId, this.multiplier ).
    subscribe(res => {
      this.snackBar.openSnackBar( "Input saved successfully", 'Close', "green-snackbar");
    },
    err => {
=======
       this.saveUserInput(status);
     } else {
       this.saveUserInput(status);
     }
  }
>>>>>>> 54d405f42ed2190437586df706dbd6e5387657f8

  saveUserInput(stats){
    this.serviceMatrix.saveUserInput(this.user['id'], this.selectedRegion, this.inpuTaskId, this.multiplier, stats).subscribe(res => {
        this.snackBar.openSnackBar( "Input saved successfully", 'Close', "green-snackbar");
      },
      err => {
        this.snackBar.openSnackBar( "Error saving input value. Please try again later", 'Close', "red-snackbar");
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


  /*ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

  closeDialog(confirm): void{
    this.dialogRef.close({'confirm': confirm});
  }

}