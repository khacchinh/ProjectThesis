import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHomeComponent } from './admin/home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { HomeComponent } from './home/home.component';

import { WordSegmentComponent } from './wordsegment/index';
import { CategoryComponent } from './category/index';
import { SingleComponent } from './singlepage/index';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'wordsegment', component: WordSegmentComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'single', component: SingleComponent },
    { path: 'admin', component: AdminHomeComponent, canActivate: [AuthGuard] },
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