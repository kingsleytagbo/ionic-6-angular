import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user-service';
import { UserOptions } from '../../models/user-options';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = {id:'',  UserName: '', EmailAddress: '' };
  submitted = false;

  constructor(
    public router: Router,
    public UserService: UserService
  ) { }

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.UserService.signup(this.signup);
      this.router.navigateByUrl('/login');
    }
  }

  onLoginClick() {
    this.router.navigateByUrl('/login');
  }
  
}
