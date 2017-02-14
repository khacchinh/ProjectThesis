import { Routes, RouterModule } from '@angular/router';

import { HomeAdminComponent } from './admin/home/index';
import { TasksComponent } from './tasks/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
	{ path: '', component: TasksComponent },
    { path: 'admin', component: HomeAdminComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);