"use strict";
var router_1 = require("@angular/router");
var index_1 = require("./admin/home/index");
var index_2 = require("./tasks/index");
var index_3 = require("./login/index");
var index_4 = require("./register/index");
var index_5 = require("./_guards/index");
var appRoutes = [
    { path: '', component: index_2.TasksComponent },
    { path: 'admin', component: index_1.HomeAdminComponent, canActivate: [index_5.AuthGuard] },
    { path: 'login', component: index_3.LoginComponent },
    { path: 'register', component: index_4.RegisterComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map