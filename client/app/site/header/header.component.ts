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
        var user = localStorage.getItem('currentUser');
        if (user){
            this.isLogin = false;
            this.user = JSON.parse(user);
        }
    }

    logout(event){
        event.preventDefault();
        this.isLogin = true;
        this.router.navigate(['/site/login']);
    }
}