import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './admin/home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { TasksComponent } from './home/home.component';

import { WordSegmentComponent } from './wordsegment/index';
import { TestCrawlerComponent } from './testcrawler/index';

const appRoutes: Routes = [
    { path: '', component: TasksComponent },
    { path: 'wordsegment', component: WordSegmentComponent },
    { path: 'clawer_news', component: TestCrawlerComponent },
    { path: 'admin', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
    exports: [RouterModule]
})

export class AppRoutingModule {}
//export const routing = RouterModule.forRoot(appRoutes, { useHash: true });