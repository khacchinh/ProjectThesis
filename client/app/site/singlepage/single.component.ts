import { Component, OnInit } from '@angular/core';
import { SingleItemService, NewsService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';

declare var $ : any;
@Component({
    moduleId: module.id,
    templateUrl: 'single.component.html',
    styleUrls : ['./single.component.css']
})

export class SingleComponent {

    private new_item : any;
    private contentHtml : any;
    private user : any;
    private comments_new : any[];
    private relative_new : any[];
    private tags : any[];
    model: any = {};


    constructor(private singleItemService: SingleItemService, private newsService: NewsService, private route: ActivatedRoute, private router: Router){
        var data = localStorage.getItem('currentUser');
        if (data){
            var parsedata = JSON.parse(data);
            this.user = parsedata.user;
            this.model.name = this.user.name;
        }
    }

    ngOnInit(){
        this.route.params.subscribe(params => {
            var id = params['id'];
            this.singleItemService.getSingleNewById(id)
                .subscribe(new_item => {
                this.new_item =  new_item;
                this.comments_new =  new_item.comment;
                this.contentHtml = this.decodeEntities(this.new_item.content);
                this.tags = new_item.tags.split(",");
                if (this.tags[this.tags.length-1] == "")
                    this.tags.length -= 1;
                var tags = {
                    "category" : new_item.category,
                    "tags" : new_item.tags,
                    "title" : new_item.title,
                    "_id" : new_item._id
                }
                this.singleItemService.getNewsRelative(tags).subscribe( data => {
                    if (data != "empty")
                        this.relative_new = data;
                    else this.relative_new = [];
                })
            });
        })  
    }

    comment(){
        var com = {
            content : this.model.comments,
            userid : this.user.name
        }

        this.singleItemService.saveCommentForNewItem(this.new_item._id, com)
            .subscribe( data => {
                this.new_item = data;
                this.comments_new = data.comment;
                this.model.comments = '';
        });
    }

    decodeEntities(encodedString) {
        var div = document.createElement('div');
        div.innerHTML = encodedString;
        return div.innerHTML; //with html
        //return text return div.textContent
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

    saveFavoriteNewsUser(news : any){
        var data = localStorage.getItem('currentUser');
        if (data){
            var parsedata = JSON.parse(data);
            var datauser = {
                "user" : parsedata.user._id,
                "news" : news._id,
                "types" : "favorite"
            }
            this.newsService.addDataUserNews(datauser).subscribe( ar_data => {
                if (ar_data){
                    parsedata.datauser.push(datauser);
                    localStorage.removeItem('currentUser');
                    localStorage.setItem('currentUser', JSON.stringify(parsedata));
                    alert("Save favorite new success!!");
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

    checkIsFavoriteNews(newsId : string) : boolean{
        var data = localStorage.getItem('currentUser');
        var isBookmark = false;
        if (data){
            var parsedata = JSON.parse(data);
            var datauser = parsedata.datauser;
            datauser.forEach(element => {
                if (element.news == newsId && element.types === "favorite"){
                    isBookmark = true;
                    return true;
                }
            });
        }
        return isBookmark;
    }

    convertDate(date:any) : string{
        return new Date(date).toLocaleString();
    }

}