import { Component, OnInit }    from '@angular/core';
import { UserService, AlertService } from '../../_services/index';

declare var $ : any;
@Component({
  moduleId: module.id,
  templateUrl: 'admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent {

  private allUser : any[];
  constructor(private userService : UserService, private alertService : AlertService){}

  ngOnInit(){
      this.userService.getAll().subscribe( users => {
        this.allUser = users;
      });
  }

  delActive(user){
    if (confirm("Are you sure??")){
      this.userService.deActiveUsers(user._id)
          .subscribe(data=>{
            $("."+user._id).text("0");
            $("#"+user._id).attr('disabled',true);
            this.alertService.success("Deactive success");
      })
    }
  }

  btnDisabled(active){
    if (active == 0)
      return true;
    return false;
  }
}
