import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { MatrixDetailsComponent } from './matrix-details/matrix-details.component';
import {HttpClientModule} from '@angular/common/http';



import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
  MatExpansionModule, MatPaginatorModule
} from '@angular/material';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ServiceMatrixService } from './service-matrix.service';


@NgModule({
  declarations: [MatrixDetailsComponent, TaskDetailsComponent],
  providers : [ServiceMatrixService],
  imports: [
    CommonModule,
    ServiceRoutingModule,
    MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
    MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatListModule,
    MatExpansionModule, HttpClientModule, MatPaginatorModule
  ]
})

export class ServiceModule { }
