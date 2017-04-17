import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard/index';
import { AdminUserComponent, AdminUserEditComponent, AdminUserAddComponent } from './admin-user/index';
import { AdminCategoryComponent } from './admin-category/index';
import { AdminAuthorComponent } from './admin-author/index';
import { AdminNewsComponent } from './admin-news/index';

import { AuthGuard }                from '../_guards/auth.guard';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'account', component: AdminUserComponent},
      { path: 'account/:id', component: AdminUserEditComponent},
      { path: 'accountadd', component: AdminUserAddComponent},
      { path: 'categorys', component: AdminCategoryComponent},
      { path: 'author', component: AdminAuthorComponent},
      { path: 'news-item', component: AdminNewsComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/