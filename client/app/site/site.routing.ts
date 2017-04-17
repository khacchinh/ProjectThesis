import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SiteComponent } from './site.component';
import { HomeComponent } from './home/home.component';
//category news
import { CategoryComponent } from './category/index';

//single page item news
import { SingleComponent } from './singlepage/index';

//search
import { SearchComponent } from './searchform/index';
import { DataUserComponent } from './datauser/index';

//login page
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const siteRoutes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      {
          path: '',
          children: [
            { path: 'category/:cate', component: CategoryComponent },
            { path: 'single/:id', component: SingleComponent },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'datauser', component: DataUserComponent },
            { path: 'search/:input', component: SearchComponent },
            { path: '', component: HomeComponent }
          ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(siteRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SiteRoutingModule {}