import { Component, OnInit }    from '@angular/core';
import { AuthorService, AlertService } from '../../_services/index';

declare var $ : any;
@Component({
  moduleId: module.id,
  templateUrl: 'admin-author.component.html'
})
export class AdminAuthorComponent {

  private allAuthor : any[];
  constructor(private authorService : AuthorService, private alertService : AlertService){}

  ngOnInit(){
      this.authorService.getAll().subscribe( author => {
        this.allAuthor = author;
      });
  }
  
  delActive(author){
    if (confirm("Do you want to deactive author?")){
      this.authorService.deActiveAuthor(author._id)
          .subscribe(data=>{
            $("."+author._id).text("0");
            $("#de_"+author._id).attr('disabled',true);
            $("#on_"+author._id).attr('disabled',false);
            this.alertService.success("Deactive success");
      })
    }
  }

  onActive(author){
    if (confirm("Do you want to active author?")){
      this.authorService.onActiveAuthor(author._id)
          .subscribe(data=>{
            $("."+author._id).text("1");
            $("#de_"+author._id).attr('disabled',false);
            $("#on_"+author._id).attr('disabled',true);
            this.alertService.success("On active success");
      })
    }
  }

  btnDeDisabled(active){
    if (active == 0)
      return true;
    return false;
  }

  btnOnDisabled(active){
    if (active == 1)
      return true;
    return false;
  }
  
}
