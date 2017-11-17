import { shim } from 'promise.prototype.finally';
shim();

import { BrowserModule } from '@angular/platform-browser';
import {enableProdMode, NgModule} from '@angular/core';
import { MobxAngularModule } from 'mobx-angular';
import { AppComponent } from './app.component';
import Api from './services/api.service';
import EmployeeStore from './services/stores/employeeStore.service';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [BrowserModule, MobxAngularModule],
  providers: [Api, EmployeeStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
