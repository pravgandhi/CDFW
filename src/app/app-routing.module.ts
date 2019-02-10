import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent} from './user/user-registration/user-registration.component';
import { MatrixDetailsComponent} from './service/matrix-details/matrix-details.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { TaskDetailsComponent } from './service/task-details/task-details.component';


const routes: Routes = [
  { path: 'user', component: UserRegistrationComponent },
  { path: 'service', component:  MatrixDetailsComponent},
  { path: 'task/:id', component:  TaskDetailsComponent},
  { path: 'login', component:  LoginFormComponent},
  { path: '', component:  LoginFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
