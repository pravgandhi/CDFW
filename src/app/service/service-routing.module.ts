import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatrixDetailsComponent } from "./matrix-details/matrix-details.component"


const routes: Routes = [
  {
    path:"",
    component: MatrixDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
