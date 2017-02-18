"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var index_1 = require("./admin/home/index");
var index_2 = require("./login/index");
var index_3 = require("./register/index");
var index_4 = require("./_guards/index");
var home_component_1 = require("./home/home.component");
var index_5 = require("./wordsegment/index");
var index_6 = require("./testcrawler/index");
var appRoutes = [
    { path: '', component: home_component_1.TasksComponent },
    { path: 'wordsegment', component: index_5.WordSegmentComponent },
    { path: 'clawer_news', component: index_6.TestCrawlerComponent },
    { path: 'admin', component: index_1.HomeComponent, canActivate: [index_4.AuthGuard] },
    { path: 'login', component: index_2.LoginComponent },
    { path: 'register', component: index_3.RegisterComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(appRoutes, { useHash: true })],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//export const routing = RouterModule.forRoot(appRoutes, { useHash: true }); 
//# sourceMappingURL=app.routing.js.map