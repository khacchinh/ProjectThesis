import { Component, OnInit }    from '@angular/core';
import { NewsService, AlertService, PagerService } from '../../_services/index';
import { Author, Category } from '../../_models/index';

@Component({
  moduleId: module.id,
  templateUrl: 'admin-news.component.html',
  styleUrls: ['./admin-news.component.css']
})
export class AdminNewsComponent {

  // pager object
  private pager: any = {};
  // paged items
  private pagedItems: any[];
  private allNews : any[];
  private model : any = {};
  private author = [
      new Author("vnexpress", "VnExpress"),
      new Author("tintuc", "Tin tức"),
      new Author("dantri", "Dân trí"),
      new Author("thanhnien", "Thanh niên"),
      new Author("zing", "Zing.VN"),
      new Author("vietnamnet news", "VietNamNet"),
  ]
  private category = [
      new Category("thế giới", "Thế giới"),
      new Category("kinh doanh", "Kinh doanh"),
      new Category("thể thao", "Thể thao"),
      new Category("công nghệ", "Công nghệ"),
      new Category("sức khỏe", "Sức khỏe"),
      new Category("pháp luật", "Pháp luật"),
  ]

  constructor(private newsService : NewsService, private alertService : AlertService, private pagerService : PagerService){
  }

  ngOnInit(){
      var params = {};
      this.newsService.getNewsBySearchParams(params).subscribe( news => {
        this.allNews = news;
        this.setPage(1);
      })
  }

  performSeach(){
      if (this.model.author == "undefined")
        delete this.model.author;
      if (this.model.category == "undefined")
        delete this.model.category;
      this.newsService.getNewsBySearchParams(this.model).subscribe( news => {
        this.allNews = news;
        this.setPage(1);
      })
  }

  delActive(newsId){
    if (confirm("Are you sure??")){
      var news = this.pagedItems;
      this.newsService.deNewsbyId(newsId)
          .subscribe(data=>{
            if (data.n == 1){
              for (var i = 0; i < news.length;i++){
                if (news[i]._id == newsId)
                  news.splice(i,1);
              }
            }
            this.alertService.success("Delete success");
        })
    }
  }

  setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allNews.length, page);

        // get current page of items
        this.pagedItems = this.allNews.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }


}
