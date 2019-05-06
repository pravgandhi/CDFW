import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { LoginModule } from './login/login.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule, MatExpansionModule, MatTabsModule, MatSelectModule, MatAutocompleteModule, 
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule, MatSnackBarModule, MatSortModule, MatPaginatorModule
} from '@angular/material';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSpinnerModule } from 'ngx-spinner';

import { FlexLayoutModule } from "@angular/flex-layout";
import { InputsComponent } from './service/inputs/inputs.component';
import { AuthenticationService } from './_services/authentication.service'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './_services';
import { DataTableModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import 'hammerjs';
import { HttpErrorInterceptor } from './_services/error-interceptor';
import { MatSnackBarComponent } from './service/mat-snack-bar/mat-snack-bar.component';
import { AuthInterceptor } from './_services/http.interceptor';
import { ResestPasswordDialog, DataTypeSelectionDialog } from './login/login-form/login-form.component';
import { FeedbackComponent } from './service/feedback/feedback.component';
import { LaborClassComponent } from './current-state/labor-class/labor-class.component';
import { LaborHourDetailsComponent } from './current-state/labor-hour-details/labor-hour-details.component';
import { LaborClassInputsComponent, DeleteCSInputDialog, EditCSInputDialog } from './current-state/labor-class-inputs/labor-class-inputs.component';

@NgModule({
  declarations: [
    AppComponent,
    MatSnackBarComponent,
    ResestPasswordDialog,
    DataTypeSelectionDialog,
    EditCSInputDialog,
    DeleteCSInputDialog,
    LaborClassComponent,
    LaborHourDetailsComponent,
    LaborClassInputsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    //material

    BrowserAnimationsModule,
    MatFormFieldModule,
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
    MatTooltipModule,
    MatTabsModule, 
    MatSelectModule, 
    MatAutocompleteModule, 
    FlexLayoutModule,
    UserModule,
    ServiceModule,
    LoginModule,
    MatSnackBarModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    DataTableModule,
    TableModule,
    DropdownModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
    AuthenticationService, UserService, MatSnackBarComponent],
  bootstrap: [AppComponent],
  entryComponents: [InputsComponent, ResestPasswordDialog, FeedbackComponent, DataTypeSelectionDialog, EditCSInputDialog, DeleteCSInputDialog]
})
export class AppModule { }
