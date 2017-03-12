import { Component, OnInit } from '@angular/core';
import { SingleItemService } from '../../_services/index';

import { ActivatedRoute } from '@angular/router';
declare var $ : any;
@Component({
    moduleId: module.id,
    templateUrl: 'single.component.html'
})

export class SingleComponent {

    private new_item : any;
    private contentHtml : any;


    constructor(private singleItemService: SingleItemService, private route: ActivatedRoute){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            var id = params['id'];
            this.singleItemService.getSingleNewById(id)
                .subscribe(new_item => {
                this.new_item = new_item;
                this.contentHtml = this.decodeEntities(this.new_item.content);
            });
        })  
    }

    decodeEntities(encodedString) {
        var div = document.createElement('div');
        div.innerHTML = encodedString;
        return div.innerHTML; //with html
        //return text return div.textContent
    }

}