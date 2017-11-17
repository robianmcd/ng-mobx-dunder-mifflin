import {Injectable} from '@angular/core';
import Api from '../api.service';
import {observable, action, computed} from 'mobx';
import Employee from '../../models/employee.model';
import asyncAction from '../../asyncAction';

@Injectable()
export default class EmployeeStore {

  @observable
  employees: Employee[];

  @observable
  loading = false;

  @computed get boss(): Employee {
    if (this.employees) {
      return this.employees.find(e => e.parentId === undefined);
    }
  }

  constructor(private api: Api) {
    this.reloadEmployees();
  }

  @asyncAction
  reloadEmployees() {
    this.loading = true;

    let storeEmployees = (employees) => {
      this.employees = employees;
      return employees;
    };

    return this.api.getEmployees()
      .then(storeEmployees)
      .finally(() => this.loading = false);
  }
}
