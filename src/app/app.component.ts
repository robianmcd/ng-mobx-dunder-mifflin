import {ChangeDetectionStrategy, Component} from '@angular/core';
import EmployeeStore from './services/stores/employeeStore.service';
import Employee from './models/employee.model';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {observable} from 'mobx';
import asyncAction from './asyncAction';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *mobxAutorun>
      hello world

      <div *ngFor="let employee of employeeStore.employees">
        {{employee.name}} - {{getChildrenString(employee)}}
      </div>

      <div *ngIf="employeeStore.boss">Boss man: {{employeeStore.boss.name}}</div>
      
      <div>
        <button (click)="employeeStore.reloadEmployees()">Axios call</button>
      </div>
      <div>
        <button (click)="setTimeoutAction()">Set Timeout</button>
        {{setTimeoutValue}}
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @observable
  setTimeoutValue = '';

  constructor(private employeeStore: EmployeeStore) {

  }


  getChildrenString(employee: Employee) {
    return employee.children.map(c => c.name).join(', ');
  }

  @asyncAction
  setTimeoutAction() {
    this.setTimeoutValue = '';
    setTimeout(() => {
        this.setTimeoutValue = 'first set timeout done';

        setTimeout(() => {
          this.setTimeoutValue = 'second set timeout done';

        }, 1000);

    }, 1000);
  }

}

declare const Zone;


// let myZone = Zone.current.fork({
//   onScheduleTask: (parentZoneDelegate, currentZone, targetZone, task) => {
//     console.log('scheduling', task);
//     return parentZoneDelegate.scheduleTask(targetZone, task);
//   },
//   onInvokeTask(delegate, currentZone, targetZone, task, ...args) {
//     const result = delegate.invokeTask(targetZone, task, ...args);
//     const name = task.callback.name;
//     console.log('invokink name');
//   },
//   onInvoke(delegate, current, target, callback, ...args) {
//     console.log(`onInvoke '${target.name}'`);
//     return delegate.invoke(target, callback, ...args);
//   }
// });
//
// myZone.run(() => {
//   console.log('task: 1');
//   Observable
//     .interval(1000)
//     .subscribe((val) => {
//         console.log(val);
//     });
//
// });
