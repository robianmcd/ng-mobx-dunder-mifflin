import {ChangeDetectionStrategy, Component} from '@angular/core';
import EmployeeStore from './services/stores/employeeStore.service';
import Employee from './models/employee.model';

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
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private employeeStore: EmployeeStore) {

  }


  getChildrenString(employee: Employee) {
    return employee.children.map(c => c.name).join(', ');
  }

}
