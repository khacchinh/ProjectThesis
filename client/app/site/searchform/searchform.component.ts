import { Component , OnInit} from '@angular/core';
import { NewsService, PagerService } from '../../_services/index';
import { News } from '../../_models/news';

import { ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    templateUrl: 'searchform.component.html',
    styleUrls: ["./searchform.component.css"]
})

export class SearchComponent implements OnInit {

    // pager object
    private pager: any = {};
    // paged items
    private pagedItems: any[];
    private paramsSearch:string;

    private news : any[];

    constructor(private newsService: NewsService, private route: ActivatedRoute, private pagerService : PagerService){
  
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            this.paramsSearch = params['input'];
            this.newsService.getNewsBySearch(this.paramsSearch)
                .subscribe(news => {
                    this.news = news;
                    console.log(news);
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

    convertDate(date:any) : string{
        return new Date(date).toString();
    }



}