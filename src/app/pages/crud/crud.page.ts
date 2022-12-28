import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserOptions } from 'src/app/models/user-options';

@Component({
  selector: 'page-crud',
  templateUrl: 'crud.page.html',
  styleUrls: ['crud.page.scss'],
})
export class CrudPage implements OnInit {
  private user: UserOptions = { id:'', UserName: '', EmailAddress: '' };
  public state:any = [];
  public loggedIn = false;

  constructor(
    public menu: MenuController,
    private UserService: UserService,
    private router: Router,
  ) { }


  ionViewWillEnter() {
    // disable the root left menu when entering the crud page
    this.menu.enable(false);
    this.getPageData();
    console.log('IonicViewWillEnter')
  }

  ionViewDidLeave() {
    // disable the root left menu when leaving the crud page
    this.menu.enable(false);
  }

  ngOnInit() {
    console.log('ngOnInit ... ')
    //this.getPageData();
    this.checkLoginStatus();
    console.log({ngOnInit: this})
  }


  checkLoginStatus() {
    return this.UserService.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
      this.updateLoggedInStatus(true);
  }

  getPageData(){
    this.state = {
      edit: false,
      delete: false,
      add: false,
      item: this.user,
      formData: this.UserService.getUsers()
    };
    console.log({getPageData: this.state})
  }

  onEditHandle(item){
    this.state.item = item;
    this.state.edit = true;
  }

  onDeleteHandle(item){
    this.state.delete = true;
    this.UserService.removeUser(item);
    this.getPageData();
  }

  onAddHandle(form:any){
    this.state.item = this.user;
    this.state.add = true;
  }

  onCancelHandle(form: NgForm){
    this.state.edit = false;
    this.state.delete = false;
    this.state.add = false;
    this.state.item = null;
  }

  onSubmitHandle(form: NgForm) {
    if (form.valid) {
      if (this.state.edit === true) {
        this.UserService.updateUser(this.state.item);
      }
      else if (this.state.add === true) {
        this.UserService.addUser({...this.state.item, id: String((this.state.formData.length + 1))});
      }
      this.getPageData();
      this.onCancelHandle(form);
    }
  }

}
