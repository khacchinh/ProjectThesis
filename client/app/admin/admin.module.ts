import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent }  from './admin-header/admin-header.component';
import { AdminFooterComponent }  from './admin-footer/admin-footer.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminAlertComponent } from './alert.component';
import { AdminRoutingModule }       from './admin.routing';

//import service
import { UserService, CategoryService } from '../_services/index';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminUserComponent,
    AdminCategoryComponent,
    AdminAlertComponent
  ],
  providers: [
    UserService,
    CategoryService
  ]
})
export class AdminModule {}