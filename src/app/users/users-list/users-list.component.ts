import { Component, ViewEncapsulation } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ColDef } from 'ag-grid-community';
import { ModuleRegistry, ValidationModule, PaginationModule, ColumnAutoSizeModule } from 'ag-grid-community';
import { ClientSideRowModelModule, ICellRendererParams } from 'ag-grid-community';
import { UserActionRendererComponent } from '../user-action-renderer/user-action-renderer.component';


// Registra il modulo prima di usarlo
ModuleRegistry.registerModules([ValidationModule ,ClientSideRowModelModule, PaginationModule, ColumnAutoSizeModule]);


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  encapsulation: ViewEncapsulation.None
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
  { headerName: 'Actions',
     cellRenderer: UserActionRendererComponent
    }
 ]

 gridOptions = {
  context: { componentParent: this }
 }


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
