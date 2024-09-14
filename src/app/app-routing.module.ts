import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { ContainerCarouselComponent } from './container-carousel/container-carousel.component';
import { AuthGuard } from './auth.guard';
import { CarouselMinComponent } from './carousel-min/carousel-min.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [

  {
    path: 'task-list', component: TaskListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'carousel', component: ContainerCarouselComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'carousel-min', component: CarouselMinComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register', component: RegisterComponent
  },
  //{ path: '',   redirectTo: '/task-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
