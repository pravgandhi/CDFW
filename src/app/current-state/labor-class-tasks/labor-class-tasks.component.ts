import { Component, OnInit, Input, ViewChild, Inject, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/_services';
import { ServiceMatrixService } from 'src/app/service/service-matrix.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBarComponent } from 'src/app/service/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-labor-class-tasks',
  templateUrl: './labor-class-tasks.component.html',
  styleUrls: ['./labor-class-tasks.component.css']
})
export class LaborClassTasksComponent implements OnInit {

  @Input('positionId') positionId: string;
  @Input('regionId') regionId: number;
  @Input("hoursEntered") hoursEntered: number;
  @Input("hoursBank") hoursBank: number;

  @Output() updateHoursEntered = new EventEmitter();

  user: Object;

  @Input("taskCatalog") taskCatalog: any;

  dataSource = new MatTableDataSource<Object>();
  searchInput: string;
  displayedColumns: string[] = ["taskId", "serviceName", "program", "subProgram", "taskCategory", "taskName", "viewTask"];
  displayedFilterColumns: string[] = [];
  globalFilter = '';
  filteredValues = {
    taskId: '', serviceName: '', program: '',
    subProgram: '', taskCategory: '', taskName: ''
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private serviceMatrix: ServiceMatrixService, public dialog: MatDialog, private snackBar: MatSnackBarComponent) { }

  ngOnInit(){
    this.user = this.userService.user;
    // this.taskCatalog = JSON.parse(localStorage.getItem('csServiceMatrix'));
    this.displayedColumns.forEach(e => {
      this.displayedFilterColumns.push(e + '-filter');
    });
      this.dataSource.data = this.taskCatalog as Object[];
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ngOnChanges(){
    
  }

  applyAllFilters(gFilter, fValues) {
    this.applyFilter(gFilter);
    this.applyColumnFilter(fValues.taskId, 'taskId');
    this.applyColumnFilter(fValues.serviceName, 'serviceName');
    this.applyColumnFilter(fValues.program, 'program');
    this.applyColumnFilter(fValues.subProgram, 'subProgram');
    this.applyColumnFilter(fValues.taskCategory, 'taskCategory');
    this.applyColumnFilter(fValues.taskName, 'taskName');
  }

  clearAllFilters() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
    this.dataSource.paginator = this.paginator;
    this.globalFilter = '';
    this.filteredValues = {
      taskId: '', serviceName: '', program: '',
      subProgram: '', taskCategory: '', taskName: ''
    };
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
        globalMatch = taskIdFound || serviceNameFound || programFound || subProgramFound || taskCategoryFound || taskNameFound;
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
      return taskIdFound && serviceNameFound && programFound && subProgramFound && taskCategoryFound && taskNameFound;
    }
    return myFilterPredicate;
  }

  applyColumnFilter(filterValue: string, col: string) {
    this.filteredValues[col] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  applyFilter(filter) {
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  addInput(task) {
    const dialogRef = this.dialog.open(AddCSInputDialog, {
      // height: "450px",
      // width: "700px",
      data: { positionId: this.positionId, task: task, hours: 0, feedback: ""
      , userId: this.user['id'], selectedRegionId: this.regionId
      , hoursBank: this.hoursBank, hoursEntered: this.hoursEntered }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res.result) {
        this.updateHoursEntered.emit(res.hours)
      }
    });
  }

}


@Component({
  selector: 'add-cs-input-dialog',
  templateUrl: 'add-cs-input-dialog.html',
  styleUrls: ['./add-cs-input-dialog.css']
})
export class AddCSInputDialog {

  constructor(
    public dialogRef: MatDialogRef<AddCSInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private serviceMatrix: ServiceMatrixService, private snackBar: MatSnackBarComponent) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAdd() {
    this.serviceMatrix.saveCsInput(this.data.selectedRegionId, this.data.userId, this.data.positionId, this.data.task.taskId, this.data.hours, this.data.feedback).subscribe(res => {
      if (res) {
        this.snackBar.openSnackBar("Input saved successfully", 'Close', "green-snackbar");
        this.dialogRef.close({"result":res, "hours":this.data.hours});
      } else {
        this.snackBar.openSnackBar("Error saving input value", 'Close', "red-snackbar");
      }
    });
  }
}
