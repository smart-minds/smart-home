import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login();
  }
  logout() {
    this.authService.logout();
  }
  getUser(){
    this.userService.getUser();
  }

}
