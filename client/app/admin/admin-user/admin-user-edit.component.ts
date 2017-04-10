import { Component, OnInit }    from '@angular/core';
import { UserService, AlertService } from '../../_services/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'admin-user-edit.component.html'
})
export class AdminUserEditComponent {

  private model: any = {};
  private userId : string;
  private user : any[];
  private access = [
      { value: 1, name: "Admin"},
      { value: 0, name: "User"},
  ]
  constructor(private userService : UserService, private alertService : AlertService, private route: ActivatedRoute){}

  ngOnInit(){
      this.route.params.subscribe(params => {
            this.userId = params['id'];
            this.userService.getUserById(this.userId)
                .subscribe(user => {
                    this.model = user;
            });
        })  
  }

  updateUser(){
    this.userService.updateUsers(this.model)
        .subscribe(data=>{
          this.model = data;
          this.alertService.success("Update user success!!");
        })
    }
}
