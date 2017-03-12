import { Component , OnInit} from '@angular/core';
import { NewsService, PagerService } from '../../_services/index';
import { News } from '../../_models/news';

import { ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'category.component.html'
})

export class CategoryComponent implements OnInit {

    // pager object
    private pager: any = {};
    // paged items
    private pagedItems: any[];
    private category:string;

    private news : any[];
    private itemHot : News;

    constructor(private newsService: NewsService, private route: ActivatedRoute, private pagerService : PagerService){
  
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            this.category = params['cate'];
            this.newsService.getNewsByCategory(this.category)
                .subscribe(news => {
                    for (var i = 0; i< news.length; i++){
                        if (news[i].type_img){
                            this.itemHot = news[i];
                            break;
                        }
                    }
                    this.news = news;
                    console.log(this.itemHot);
                    this.setPage(1);
            });
        })  
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.news.length, page);

        // get current page of items
        this.pagedItems = this.news.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }



}