import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from 'src/app/employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees?: Employee[];
  public editEmployee?: Employee;
  public deleteEmployee?: Employee;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
    this.getEmployees();
  }

    public getEmployees(): void{
      this.employeeService.getEmployees().subscribe((response: Employee[]) => {
        this.employees = response;
        
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
      );
    }

    public onAddEmployee(addForm: NgForm): void {
      const addEmployeeFormButton =  document.getElementById('add-employee-form');
      if(addEmployeeFormButton){
        addEmployeeFormButton.click();
      }

      this.employeeService.addEmployee(addForm.value).subscribe(
        (response: Employee) => {
          this.getEmployees();
          addForm.reset();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          addForm.reset();
        }
      );
    }
  
    public onUpdateEmployee(employee: Employee): void {
      this.employeeService.updateEmployee(employee).subscribe(
        (response: Employee) => {
          this.getEmployees();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  
    
    public onDeleteEmployee(employeeId: number): void {
      this.employeeService.deleteEmployee(employeeId).subscribe(
        (response: void) => {
          this.getEmployees();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  
    public searchEmployees(key: string): void {
      const results: Employee[] = [];
      if(this.employees){
      for (const employee of this.employees) {
        if (employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(employee);
        }
      }
    }
      this.employees = results;
      if (results.length === 0 || !key) {
        this.getEmployees();
      }
    }
  
    public onOpenModal(employee: Employee | null, mode: string): void {
      const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
      if (mode === 'add') {
        button.setAttribute('data-target', '#addEmployeeModal');
      }
      if (mode === 'edit') {
        if(employee){
        this.editEmployee = employee;
      }
        button.setAttribute('data-target', '#updateEmployeeModal');
      }
      if (mode === 'delete') {
        if(employee){
        this.deleteEmployee = employee;
        }
        button.setAttribute('data-target', '#deleteEmployeeModal');
      }
      container?.appendChild(button);
      button.click();
    }
    
}
