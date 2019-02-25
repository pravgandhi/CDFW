import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { LoginModule } from './login/login.module';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatSidenavModule
} from '@angular/material';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { InputsComponent } from './service/inputs/inputs.component';
import {AuthenticationService} from   './_services/authentication.service'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './_services';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    //material
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FlexLayoutModule,

    UserModule,
    ServiceModule,
    LoginModule,


  ],
  providers: [AuthenticationService, UserService],
  bootstrap: [AppComponent],
  entryComponents: [InputsComponent]
})
export class AppModule { }
