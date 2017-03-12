import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { CarouselModule, TabsModule  } from 'ng2-bootstrap';


import { AlertService, AuthenticationService, UserService, TaskService, NewsService, PagerService, SingleItemService } from '../_services/index';

import { SiteComponent } from './site.component';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { HomeComponent } from './home/index';

//demo TaskS
import { TasksComponent } from './tasks_demo/index';

import { WordSegmentComponent } from './wordsegment/index';

//category news
import { CategoryComponent } from './category/index';

//single page item news
import { SingleComponent } from './singlepage/index';


//header and footer
import { HeaderComponent } from './header/index';
import { FooterComponent } from './footer/index';
import { RightBarComponent } from './rightbar/index';

import { SiteRoutingModule } from './site.routing';

import { AlertComponent } from '../_directives/index';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SiteRoutingModule,
    CarouselModule.forRoot(),
    TabsModule.forRoot()
  ],
  declarations: [
    SiteComponent,
    HomeComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    TasksComponent,
    WordSegmentComponent,
    CategoryComponent,
    SingleComponent,
    HeaderComponent,
    FooterComponent,
    RightBarComponent
  ],
  providers: [
    AlertService,
    AuthenticationService,
    UserService,
    TaskService,
    NewsService,
    PagerService,
    SingleItemService
  ]
})
export class SiteModule {}