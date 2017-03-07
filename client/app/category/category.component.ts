import { Component , OnInit} from '@angular/core';
import { NewsService } from '../_services/news.service';
import { News } from '../_models/news';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'category.component.html'
})

export class CategoryComponent implements OnInit { 
    private page:number = 1;
    private limit:number = 10;
    private category:string;

    private news : News[];

    constructor(private newsService: NewsService, private route: ActivatedRoute, private router: Router){

    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            this.category = params['cate'];
            this.newsService.getNewsByCategory(this.category, this.page, this.limit)
                .subscribe(news => {
                    this.news = news.docs;
            });
        })  
    }


 
    public pageChanged(event:any):void {
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
    }
}