import { Component }    from '@angular/core';
import { UserService, AlertService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'admin-user-add.component.html'
})
export class AdminUserAddComponent {

  private model: any = {};
  private access = [
      { value: 1, name: "Admin"},
      { value: 0, name: "User"},
  ]
  constructor(private userService : UserService, private alertService : AlertService){}

  addUser(){
    this.userService.addUsers(this.model)
        .subscribe(data=>{
          this.model = data;
          this.alertService.success("Add user success!!");
        })
  }

  
}
