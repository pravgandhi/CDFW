import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/_services';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-labor-class-inputs',
  templateUrl: './labor-class-inputs.component.html',
  styleUrls: ['./labor-class-inputs.component.css']
})
export class LaborClassInputsComponent implements OnInit {

  @Input('positionId') positionId: string;
  @Input('regionId') regionId: number;
  @Output() hoursEntered = new EventEmitter();
  @Output() copyInd = new EventEmitter();
//  @Input('laborMappings') laborMappings: any;
  _laborMappings: any;
  @Input("hoursEntered") hoursEnterd: number;
  @Input("hoursBank") hoursBank: number;

  result: any[];
  user: Object;
  positions: any;
  isCopyListEmpty :boolean = false;

  constructor(private userService: UserService, private serviceMatrix: ServiceMatrixService, public dialog: MatDialog, private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.customInit();
    this.user = this.userService.user;
  }

  get laborMappings(): any {
   // transform value for display
   return this._laborMappings;
 }

 @Input('laborMappings')
 set laborMappings(laborMappings: any) {
   this._laborMappings = laborMappings.filter(e => e['positionId'] != this.positionId);
 }

  customInit() {
    let _self = this;
    this.serviceMatrix.getLaborClassSummaryByPositionId(this.regionId, this.positionId).subscribe(res => {
      _self.result = _(res)
        .groupBy(x => x['taskId'])
        .map((value, key) => ({ taskId: key, tasks: value }))
        .value();

      let he = _.sumBy(res as [], function (e) {
          return e['inputHours'];
      });

      this.hoursEntered.emit(he);
    });
  }

  editInput(task) {
    const dialogRef = this.dialog.open(EditCSInputDialog, {
      data: { task: task, hoursBank: this.hoursBank, hoursEntered: this.hoursEnterd }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customInit();
      }
    });
  }

  deleteInput(task) {
    const dialogRef = this.dialog.open(DeleteCSInputDialog, {
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customInit();
      }
    });
  }

  approveCSInput(task) {
    this.serviceMatrix.approveCSInput(task, this.userService.userId).subscribe(res => {
      if (res) {
        this.snackBar.openSnackBar("Input Validated", 'Close', "green-snackbar");
        this.customInit();
        //this.dialogRef.close(res);
      } else {
        this.snackBar.openSnackBar("Error approving input", 'Close', "red-snackbar");
      }
    });
  /*  const dialogRef = this.dialog.open(ApproveCSInputDialog, {
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customInit();
      }
    });*/
  }


    copyTasks(){
      this.isCopyListEmpty = false;
      if(this.positions == undefined || this.positions.length == 0) {
        this.snackBar.openSnackBar( "Please select position ids", 'Close', "red-snackbar");
      } else {
        let destinationPositions = this.positions.map(a => a.positionId);
        let tasksToBeCopied:string[] = this.result.map(a => a.taskId);
        this.serviceMatrix.copyTasks(this.regionId, this.userService.userId, this.positionId, destinationPositions,
           tasksToBeCopied).subscribe(res => {
          this.snackBar.openSnackBar( "Tasks copied successfully", 'Close', "green-snackbar");
          this.copyInd.emit();
        }, err => {
          this.snackBar.openSnackBar( "Error copying tasks", 'Close', "red-snackbar");
        });
      }
    }

}

@Component({
  selector: 'edit-cs-input-dialog',
  templateUrl: 'edit-cs-input-dialog.html',
})
export class EditCSInputDialog {

  staticInputHours: number = this.data.task.inputHours;

  constructor(
    public dialogRef: MatDialogRef<EditCSInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceMatrix: ServiceMatrixService, private snackBar: MatSnackBarComponent,
    private userService :UserService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate() {
    this.serviceMatrix.editCSInput(this.data.task, this.userService.userId).subscribe(res => {
      if (res) {
        this.snackBar.openSnackBar("Input saved successfully", 'Close', "green-snackbar");
        this.dialogRef.close(res);
      } else {
        this.snackBar.openSnackBar("Error saving input value", 'Close', "red-snackbar");
      }
    });
  }
}

@Component({
  selector: 'delete-cs-input-dialog',
  templateUrl: 'delete-cs-input-dialog.html',
})
export class DeleteCSInputDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteCSInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceMatrix: ServiceMatrixService, private snackBar: MatSnackBarComponent) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.serviceMatrix.deleteCSInput(this.data.task).subscribe(res => {
      if (res) {
        this.snackBar.openSnackBar("Input deleted successfully", 'Close', "green-snackbar");
        this.dialogRef.close(res);
      } else {
        this.snackBar.openSnackBar("Error deleting input value", 'Close', "red-snackbar");
      }
    });
  }
}


@Component({
  selector: 'approve-cs-input-dialog',
  templateUrl: 'approve-cs-input-dialog.html',
})
export class ApproveCSInputDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteCSInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceMatrix: ServiceMatrixService,
    private snackBar: MatSnackBarComponent,
    private userService :UserService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm() {
    this.serviceMatrix.approveCSInput(this.data.task, this.userService.userId).subscribe(res => {
      if (res) {
        this.snackBar.openSnackBar("Input approved successfully", 'Close', "green-snackbar");
        this.dialogRef.close(res);
      } else {
        this.snackBar.openSnackBar("Error approving input", 'Close', "red-snackbar");
      }
    });
  }
}
