import {action, computed, observable} from 'mobx';
import EmployeeStore from '../services/stores/employeeStore.service';

export default class Employee {
  readonly id: string;
  @observable name: string;
  @observable parentId: string;

  readonly employeeStore: EmployeeStore;

  @computed get children(): Employee[] {
    if (this.employeeStore.employees) {
      return this.employeeStore.employees.filter(e => e.parentId === this.id);
    } else {
      return [];
    }
  }

  constructor({id, name, parentId, employeeStore}) {
    this.employeeStore = employeeStore;

    this.id = id;
    this.name = name;
    this.parentId = parentId;
  }

  static fromApiFormat(apiEmployee: ApiEmployee, employeeStore: EmployeeStore) {
    return new Employee({...apiEmployee, employeeStore});
  }
}

export interface ApiEmployee {
  id: string;
  name: string;
  parentId: string;
}
