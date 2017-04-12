import { Component, OnInit } from '@angular/core';
import { SingleItemService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';

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
    model: any = {};


    constructor(private singleItemService: SingleItemService, private route: ActivatedRoute){
        var user = localStorage.getItem('currentUser');
        if (user){
            this.user = JSON.parse(user);
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

}