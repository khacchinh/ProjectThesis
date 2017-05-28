import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { AuthGuard } from './_guards/index';

import { AppComponent }  from './app.component';
import { LoginComponent, AlerLogintComponent } from './loginadmin/index';
import { PageNotFoundComponent }   from './not-found.component';
import { AppRoutingModule }        from './app.routing';

import { AlertService, AuthenticationService } from './_services/index';
import { AppConfig } from './app.config';



@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        AlerLogintComponent,
        PageNotFoundComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        AppConfig,
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }