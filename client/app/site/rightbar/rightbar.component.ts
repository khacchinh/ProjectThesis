import { Component } from '@angular/core';
 import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app-rightbar',
    templateUrl: 'rightbar.component.html'
})

export class RightBarComponent { 
    private paramsSearch:any;
    private router: Router;
    constructor(router: Router){
        this.router = router;
    }

    performSeach(){
        if (typeof this.paramsSearch =='undefined' || this.paramsSearch == "")
            alert("Input text search");
        else{
            this.router.navigate(['/site/search', this.paramsSearch]);
        }
    }
}