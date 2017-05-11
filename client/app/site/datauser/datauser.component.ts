import { Component , OnInit} from '@angular/core';
import { UserService } from '../../_services/index';

import { Router } from '@angular/router';
declare var $ : any;
@Component({
    moduleId: module.id,
    templateUrl: 'datauser.component.html',
    styleUrls: ["./datauser.component.css"]
})

export class DataUserComponent implements OnInit {

    private datauser : any[];
    private user : any;

    constructor(private usersSevice: UserService, private router: Router){
  
    }

    ngOnInit(){
        var data = localStorage.getItem('currentUser');
        if (data){
            var parsedata = JSON.parse(data);
            this.user = parsedata.user;
            this.usersSevice.getDataNewsUserByIdDetail(this.user._id).subscribe( data => {
                this.datauser = data;
            })
        } else {
            this.router.navigate(['/site/login']);
        }
    }

    convertDate(date:any) : string{
        return new Date(date).toString();
    }

    removeNewsDataUser(news_id : string, types : string, index : number){
        var data = {
            "user" : this.user._id,
            "news" : news_id,
            "types" : types
        }
        this.usersSevice.removeDataUser(data).subscribe(result => {
            if (result){
                this.datauser.splice(index, 1);
                var data = localStorage.getItem('currentUser');
                var parsedata = JSON.parse(data);
                parsedata.datauser.splice(index, 1);
                localStorage.removeItem('currentUser');
                localStorage.setItem('currentUser', JSON.stringify(parsedata));
                alert('success');
            }
        });
        return false;
    }
}