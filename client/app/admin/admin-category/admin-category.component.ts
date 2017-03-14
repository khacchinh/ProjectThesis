import { Component, OnInit }    from '@angular/core';
import { CategoryService, AlertService } from '../../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'admin-category.component.html'
})
export class AdminCategoryComponent {

  private allCategory : any[];
  constructor(private categoryService : CategoryService, private alertService : AlertService){}

  ngOnInit(){
      this.categoryService.getAll().subscribe( categorys => {
        this.allCategory = categorys;
      });
  }
}
