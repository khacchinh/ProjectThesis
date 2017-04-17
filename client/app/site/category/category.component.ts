import { Component , OnInit} from '@angular/core';
import { NewsService, PagerService } from '../../_services/index';
import { News } from '../../_models/news';

import { ActivatedRoute, Router } from '@angular/router';
declare var $ : any;
@Component({
    moduleId: module.id,
    templateUrl: 'category.component.html',
    styleUrls: ["./category.component.css"]
})

export class CategoryComponent implements OnInit {

    // pager object
    private pager: any = {};
    // paged items
    private pagedItems: any[];
    private category:string;

    private news : any[];
    private itemHot : News;

    constructor(private newsService: NewsService, private route: ActivatedRoute, private pagerService : PagerService, private router: Router){
  
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

    saveBookmarkNewsUser(news : any){
        var data = localStorage.getItem('currentUser');
        if (data){
            var parsedata = JSON.parse(data);
            var datauser = {
                "user" : parsedata.user._id,
                "news" : news._id,
                "types" : "bookmark"
            }
            this.newsService.addDataUserNews(datauser).subscribe( ar_data => {
                if (ar_data){
                    parsedata.datauser.push(datauser);
                    localStorage.removeItem('currentUser');
                    localStorage.setItem('currentUser', JSON.stringify(parsedata));
                    alert("Save bookmark new success!!");
                }
                else alert("Fail to save new.");
            });
        } else if (confirm("Are you want to login?")){
            this.router.navigate(['/site/login']);
        }
        return false;
    }

    checkIsBookmarkNews(newsId : string) : boolean{
        var data = localStorage.getItem('currentUser');
        var isBookmark = false;
        if (data){
            var parsedata = JSON.parse(data);
            var datauser = parsedata.datauser;
            datauser.forEach(element => {
                if (element.news == newsId && element.types === "bookmark"){
                    isBookmark = true;
                    return true;
                }
            });
        }
        return isBookmark;
    }
}