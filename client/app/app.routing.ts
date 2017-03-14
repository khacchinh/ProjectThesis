import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent }    from './not-found.component';
import { LoginComponent } from './loginadmin/index';
import { AuthGuard }                from './_guards/auth.guard';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';


const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'site',
    loadChildren: 'app/site/site.module#SiteModule',
    data: { preload: true }
  },
  { path: '',   redirectTo: '/site', pathMatch: 'full' },
  { path: 'login',   component:  LoginComponent},
  { path: '**', component: PageNotFoundComponent }
];



@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, 
            {useHash: true, preloadingStrategy: SelectivePreloadingStrategy})
    ],
    exports: [RouterModule],
    providers:[
        SelectivePreloadingStrategy
    ]
})

export class AppRoutingModule {}
//export const routing = RouterModule.forRoot(appRoutes, { useHash: true });