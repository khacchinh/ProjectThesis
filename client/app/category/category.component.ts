import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'category.component.html'
})

export class CategoryComponent { 
    public maxSize:number = 5;
    public bigTotalItems:number = 30;
    public bigCurrentPage:number = 1;
    public numPages:number = 0;
 
    public pageChanged(event:any):void {
        console.log('Page changed to: ' + event.page);
        console.log('Number items per page: ' + event.itemsPerPage);
    }
}