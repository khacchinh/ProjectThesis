import { Component, OnInit, ElementRef } from '@angular/core';
import { NewsService } from '../../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  styleUrls: ["./home.component.css"]
})
export class HomeComponent {

  private data : any[];
  private news_home = [];
  constructor(private newsService : NewsService, private elementRef:ElementRef){}

  ngOnInit(){
    this.newsService.getNewsHot().subscribe(news => {
      this.data = news;
      this.news_home.push(news.thegioi[0]);
      this.news_home.push(news.kinhdoanh[0]);
      this.news_home.push(news.congnghe[0]);
      this.news_home.push(news.suckhoe[0]);
      this.news_home.push(news.phapluat[0]);
      this.news_home.push(news.thethao[0]);
    })
  }

  ngAfterViewInit(){
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "asset/js/bootsnipp.js";
    this.elementRef.nativeElement.appendChild(s);
  }

  convertDate(date:any) : string{
        return new Date(date).toLocaleString();
    }

}