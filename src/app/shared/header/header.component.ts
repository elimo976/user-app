import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: any[] = [];
  loginLabel: string = '';
  dashboardLabel: string = '';
  userListLabel: string = '';

  constructor(
    private translocoService: TranslocoService,
    private router: Router
    ) {}

  ngOnInit(): void {
    // Sottoscrizione per label 'menu.login'
    this.translocoService.selectTranslate('menu.login').subscribe(loginLabel => {
      this.loginLabel = loginLabel;
      this.updateMenuItems();
    });

    // Sottoscrizione per label 'menu.dashboard'
    this.translocoService.selectTranslate('menu.dashboard').subscribe(dashboardLabel => {
      this.dashboardLabel = dashboardLabel;
      this.updateMenuItems();
    });

    // Sottoscrizione per label 'menu.userList'
    this.translocoService.selectTranslate('menu.userList').subscribe(userListLabel => {
      this.userListLabel = userListLabel;
      this.updateMenuItems();
    });
  }

  updateMenuItems(): void {
    if (this.dashboardLabel && this.userListLabel && this.loginLabel) {
      this.items = [
        {
          label: this.loginLabel,
          icon: 'pi pi-fw pi-user',
          command: () => this.navigateToLogin()
        },
        {
          label: this.dashboardLabel,
          icon: 'pi pi-fw pi-home',
          command: () => this.navigateToDashboard()
        },
        {
          label: this.userListLabel,
          icon: 'pi pi-fw pi-users',
          command: () => this.navigateToUserList()
        }
      ];
    }
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  navigateToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  navigateToUserList(): void {
    this.router.navigateByUrl('/userList');
  }
}

