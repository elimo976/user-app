import { Component } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { MessageService } from 'primeng/api';
import { ColDef } from 'ag-grid-community';
import { ModuleRegistry, ValidationModule, PaginationModule, ColumnAutoSizeModule } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';


// Registra il modulo prima di usarlo
ModuleRegistry.registerModules([ValidationModule ,ClientSideRowModelModule, PaginationModule, ColumnAutoSizeModule]);


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
 users: User[] = [];
 selectedUser: User | null = null;
 displayUserDetail = false;

 columnDefs: ColDef[] = [
  { headerName: ' First Name', field: 'firstName' },
  { headerName: 'Last Name', field: 'lastName' },
  { headerName: 'Email', field: 'email' },
  { headerName: 'Role', field: 'role'},
  { headerName: 'Actions', cellRenderer: 'agCheckboxCellRenderer' }
 ]


 constructor(
  private userService: UsersService,
  // private messageService: MessageService
 ) {}

 ngOnInit(): void {
  this.loadUsers();
 }

 loadUsers(): void {
  this.userService.getAllUsers().subscribe(users => {
    this.users = users;
  })
 }

 onGridReady(params: any) {
  params.api.sizeColumnsToFit();
 }

 openUserDetail(user: User): void {
  this.selectedUser = user;
  this.displayUserDetail = true;
 }

 closeUserDetail(): void {
  this.displayUserDetail = false;
  this.selectedUser = null;
 }
}
