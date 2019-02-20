import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { MatrixDetailsComponent } from './matrix-details/matrix-details.component';



import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
  MatExpansionModule, MatPaginatorModule, MatSortModule, MatSidenavModule
} from '@angular/material';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ServiceMatrixService } from './service-matrix.service';
import { InputsComponent } from './inputs/inputs.component';


@NgModule({
  declarations: [MatrixDetailsComponent, TaskDetailsComponent, InputsComponent],
  providers : [ServiceMatrixService],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
    MatExpansionModule,  MatPaginatorModule, MatSortModule, MatSidenavModule
  ]
})

export class ServiceModule { }
