import {Injectable, Injector} from '@angular/core';
import axios from 'axios';
import Employee, {ApiEmployee} from '../models/employee.model';
import EmployeeStore from './stores/employeeStore.service';
import {action, runInAction} from 'mobx';

@Injectable()
export default class Api {
  constructor(private injector: Injector) {

  }

  getEmployees(): Promise<ApiEmployee[]> {
    let parseEmployees = res => {
      return res.data.map(
        apiEmployee => Employee.fromApiFormat(apiEmployee, this.injector.get(EmployeeStore))
      );
    };

    return axios.get<ApiEmployee[]>('/api/employees')
      .then(parseEmployees);
  }

}
