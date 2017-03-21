import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { AdminComponent }           from './admin.component';
import { AdminDashboardComponent }  from './admin-dashboard/index';
import { AdminHeaderComponent }  from './admin-header/index';
import { AdminFooterComponent }  from './admin-footer/index';
import { AdminUserComponent, AdminUserEditComponent, AdminUserAddComponent } from './admin-user/index';
import { AdminCategoryComponent } from './admin-category/index';
import { AdminAlertComponent } from './alert.component';
import { AdminRoutingModule }       from './admin.routing';

//import service
import { UserService, CategoryService } from '../_services/index';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminUserComponent,
    AdminCategoryComponent,
    AdminAlertComponent,
    AdminUserEditComponent,
    AdminUserAddComponent
  ],
  providers: [
    UserService,
    CategoryService
  ]
})
export class AdminModule {}