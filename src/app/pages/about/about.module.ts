import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AboutPage } from './about';
import { AboutPageRoutingModule } from './about-routing.module';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    FooterModule,
    IonicModule,
    AboutPageRoutingModule
  ],
  declarations: [AboutPage],
  entryComponents: [],
  bootstrap: [AboutPage],
})
export class AboutModule {}
