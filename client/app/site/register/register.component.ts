﻿import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.userService.checkExistUser(this.model.username).subscribe(data => {
            if (!data.isExist){
                this.userService.addUsers(this.model)
                    .subscribe(
                        data => {
                            this.alertService.success('Registration successful', true);
                            this.router.navigate(['./site/login']);
                        },
                        error => {
                            this.alertService.error(error);
                            this.loading = false;
                });
            } else{
                this.alertService.error("User already exist");
                this.loading = false;
            }
        })
    }
}
