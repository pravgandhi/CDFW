import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';


import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule
} from '@angular/material';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
     MatInputModule,
     MatTableModule,
     MatToolbarModule,
     MatMenuModule,
     MatIconModule,
     MatProgressSpinnerModule,
     BrowserAnimationsModule
  ]
})
export class LoginModule { }
