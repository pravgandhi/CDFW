import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent} from './user/user-registration/user-registration.component';
import { MatrixDetailsComponent} from './service/matrix-details/matrix-details.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { TaskDetailsComponent } from './service/task-details/task-details.component';
import { AuthGuard } from './_guards';


const routes: Routes = [
  { path: 'user', component: UserRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'service', component:  MatrixDetailsComponent, canActivate: [AuthGuard]},
  { path: 'task/:id', component:  TaskDetailsComponent, canActivate: [AuthGuard]},
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
