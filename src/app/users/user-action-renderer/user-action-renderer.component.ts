import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-user-action-renderer',
  templateUrl: './user-action-renderer.component.html',
  styleUrl: './user-action-renderer.component.css'
})
export class UserActionRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  viewUser(): void {
    if (this.params.context?.componentParent?.openUserDetail) {
      this.params.context.componentParent.openUserDetail(this.params.data);
    } else {
      console.error('openUserDetail non è definito nel componente padre');
    }
  }

  editUser(): void {
    console.log('Modifica utente:', this.params.data);
  }

  deleteUser(): void {
    console.log('Elimina utente:', this.params.data);
  }
}
