import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NewsService } from '../../_services/index';

@Component({
    moduleId: module.id,
    selector: 'app-rightbar',
    templateUrl: 'rightbar.component.html',
    styleUrls: ["./rightbar.component.css"]
})

export class RightBarComponent { 
    private paramsSearch:any;
    private router: Router;
    private pupolarnews : any[];
    private commentnews : any[];
    constructor(router: Router, private newsService : NewsService){
        this.router = router;
    }

    ngOnInit(){
        this.newsService.getNewsPopular().subscribe(news => {
            this.pupolarnews = news;
        });
        this.newsService.getNewsComment().subscribe(news => {
            this.commentnews = news;
        })
    }

    performSeach(){
        if (typeof this.paramsSearch =='undefined' || this.paramsSearch == "")
            alert("Input text search");
        else{
            this.router.navigate(['/site/search', this.paramsSearch]);
        }
    }
}