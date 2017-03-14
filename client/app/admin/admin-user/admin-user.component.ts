import { Component, OnInit }    from '@angular/core';
import { UserService, AlertService } from '../../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'admin-user.component.html'
})
export class AdminUserComponent {

  private allUser : any[];
  constructor(private userService : UserService, private alertService : AlertService){}

  ngOnInit(){
      this.userService.getAll().subscribe( users => {
        this.allUser = users;
      });
  }

  delActive(value){
    alert(value);
    this.alertService.success("Deactive success");
  }
}
