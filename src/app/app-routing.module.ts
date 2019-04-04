import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent} from './user/user-registration/user-registration.component';
import { MatrixDetailsComponent} from './service/matrix-details/matrix-details.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { TaskDetailsComponent } from './service/task-details/task-details.component';
import { AuthGuard } from './_guards';
import { LaborClassComponent } from './current-state/labor-class/labor-class.component';
import { LaborHourDetailsComponent } from './current-state/labor-hour-details/labor-hour-details.component';


const routes: Routes = [
  { path: 'user', component: UserRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'service/:regionId', component:  MatrixDetailsComponent, canActivate: [AuthGuard]},
  { path: ':regionId/task/:taskId', component:  TaskDetailsComponent, canActivate: [AuthGuard]},
  { path: 'currentState/:regionId', component:  LaborClassComponent, canActivate: [AuthGuard]},
  { path: 'cslaborhours', component:  LaborHourDetailsComponent, canActivate: [AuthGuard]},
  { path: 'login', component:  LoginFormComponent},
  { path: '', component:  LoginFormComponent},
  // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
