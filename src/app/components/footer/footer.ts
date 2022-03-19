import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RootStoreState } from 'src/app/state/root/root-store-state';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'page-footer',
  templateUrl: 'footer.html',
  styleUrls: ['footer.scss'],
})
export class Footer implements OnInit{
  Authentication$: Observable<any>;
  WebsiteName = environment.WEBSITE_NAME;
  constructor(private store: Store<RootStoreState>) { 

  }
  ngOnInit() {  
    this.Authentication$ = this.store.select(state => state.Authentication);
  }  


}
