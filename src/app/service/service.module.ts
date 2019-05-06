import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { MatrixDetailsComponent } from './matrix-details/matrix-details.component';
import { FormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
  MatExpansionModule, MatPaginatorModule, MatSortModule, MatSidenavModule
} from '@angular/material';
import { TaskDetailsComponent, SaveResponseConfirmDialog } from './task-details/task-details.component';
import { ServiceMatrixService } from './service-matrix.service';
import { InputsComponent } from './inputs/inputs.component';

import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { FeedbackComponent } from './feedback/feedback.component';


@NgModule({
  declarations: [MatrixDetailsComponent, TaskDetailsComponent, InputsComponent, SaveResponseConfirmDialog, FeedbackComponent],
  entryComponents : [SaveResponseConfirmDialog],
  providers : [ServiceMatrixService],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
    MatExpansionModule,  MatPaginatorModule, MatSortModule, MatSidenavModule, MatTooltipModule,
    MatTabsModule,
    FormsModule,
    NgbModule.forRoot(),
    NgbTooltipModule
  ]
})

export class ServiceModule { }
