import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AppComponent }  from './app.component';
import { AppRoutingModule }        from './app.routing';

//bootstrap
import { CarouselModule, TabsModule, PaginationModule  } from 'ng2-bootstrap';

import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { AlertService, AuthenticationService, UserService, TaskService, NewsService } from './_services/index';
import { AdminHomeComponent } from './admin/home/index';
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

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        CarouselModule.forRoot(),
        TabsModule.forRoot(),
        PaginationModule.forRoot()
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        CategoryComponent,
        SingleComponent,
        WordSegmentComponent,
        HeaderComponent,
        FooterComponent,
        RightBarComponent,
        TasksComponent,
        // admin
        AdminHomeComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        TaskService,
        NewsService,
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }