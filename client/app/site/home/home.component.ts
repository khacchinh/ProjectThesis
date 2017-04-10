import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html'
})
export class HomeComponent {

  private data : any[];
  constructor(private newsService : NewsService){}

  ngOnInit(){
    this.newsService.getNewsHot().subscribe(news => {
      this.data = news;
    })
  }

}