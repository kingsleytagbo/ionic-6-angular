import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public loggedIn = false;
  public features = [
    { val: 'Components', isChecked: true ,color:'success' },
    { val: 'Authentication', isChecked: true ,color:'info' },
    { val: 'Data Access', isChecked: true ,color:'warning' },
    { val: 'Filtering', isChecked: true ,color:'primary' },
    { val: 'Searching', isChecked: false ,color:'warning' },
    { val: 'Sorting', isChecked: true ,color:'dark' },
    { val: 'User Management', isChecked: true ,color:'danger' },
    { val: 'Roles & Permissions Management', isChecked: false ,color:'dark' },
  ];
  constructor() {}

}
