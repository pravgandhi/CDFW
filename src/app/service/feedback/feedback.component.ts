import { Component, OnInit, Inject } from '@angular/core';
import { ServiceMatrixService } from '../service-matrix.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { UserService } from 'src/app/_services';
import { MatSnackBarComponent } from '../mat-snack-bar/mat-snack-bar.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
    user: Object;
    selectedRegionObject: any;
    feedbacks = new MatTableDataSource<Object>();
    inputDisplayedColumns: string[] = [ "name", "feedback"];

    errorMessage: string = null;
    successMessage: string = null;

    constructor(private serviceMatrix: ServiceMatrixService,
        public dialogRef: MatDialogRef<FeedbackComponent>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private router: Router, private snackBar: MatSnackBarComponent
    ) {}

    ngOnInit() {
        this.user = this.userService.user;
        this.selectedRegionObject = this.userService.getSelectedRegionObject(this.data.regionName);
        this.fetchFeedbacks();
    }

    fetchFeedbacks(): any {
        let _self = this;
        this.serviceMatrix.fetchInputs(this.selectedRegionObject.regionId, this.data.taskId ).subscribe(
        data => {
            var dt = data as Object[];            
            _self.feedbacks.data = dt.filter(e => e['feedback'] != null && e['feedback'] != '');
        },
        err => {
            this.errorMessage = "Error fectching input values. Please try again later."
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}