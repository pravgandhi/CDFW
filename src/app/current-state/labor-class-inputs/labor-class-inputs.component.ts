import { Component, OnInit, Input, Inject } from '@angular/core';
import { UserService } from 'src/app/_services';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import * as _ from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-labor-class-inputs',
  templateUrl: './labor-class-inputs.component.html',
  styleUrls: ['./labor-class-inputs.component.css']
})
export class LaborClassInputsComponent implements OnInit {

  @Input('positionId') positionId: string;
  @Input('regionId') regionId: number;
  result: any[];
  user: Object;

  constructor(private userService: UserService, private serviceMatrix: ServiceMatrixService, public dialog: MatDialog, private snackBar: MatSnackBarComponent) { }

  ngOnInit() {
    this.customInit();
    this.user = this.userService.user;
  }

  customInit() {
    let _self = this;
    this.serviceMatrix.getLaborClassSummaryByPositionId(this.regionId, this.positionId).subscribe(res => {
      _self.result = _(res)
        .groupBy(x => x['taskId'])
        .map((value, key) => ({ taskId: key, tasks: value }))
        .value();
    });
  }

  editInput(task) {
    const dialogRef = this.dialog.open(EditCSInputDialog, {
      data: { task: task }
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
    const dialogRef = this.dialog.open(ApproveCSInputDialog, {
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customInit();
      }
    });
  }

}

@Component({
  selector: 'edit-cs-input-dialog',
  templateUrl: 'edit-cs-input-dialog.html',
})
export class EditCSInputDialog {

  constructor(
    public dialogRef: MatDialogRef<EditCSInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceMatrix: ServiceMatrixService, private snackBar: MatSnackBarComponent) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate() {
    this.serviceMatrix.editCSInput(this.data.task).subscribe(res => {
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
