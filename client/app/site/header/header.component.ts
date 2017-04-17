import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: 'header.component.html'
})

export class HeaderComponent { 
    private isLogin = true;
    private user : any;
    constructor(private router: Router){
        var data = localStorage.getItem('currentUser');
        var parsedata = JSON.parse(data);
        if (parsedata){
            this.isLogin = false;
            this.user = parsedata.user;
        }
    }

    logout(event){
        event.preventDefault();
        this.isLogin = true;
        this.router.navigate(['/site/login']);
        return false;
    }
}