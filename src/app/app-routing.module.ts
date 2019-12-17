import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';

import { UsersComponent } from '../manager/users/users.component';
import { RolesComponent } from '../manager/roles/roles.component';
import { PermissionsComponent } from '../manager/permissions/permissions.component';

import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent,
    children: [
      { path: 'roles', component: RolesComponent, outlet: 'sideview', canActivate: [AuthGuard]},
      { path: 'users', component: UsersComponent, outlet: 'sideview', canActivate: [AuthGuard]},
      { path: 'permissions', component: PermissionsComponent, outlet: 'sideview', canActivate: [AuthGuard]}
    ],
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
