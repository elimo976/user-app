import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: any[] = [];
  loginLabel: string = '';
  dashboardLabel: string = '';
  usersListLabel: string = '';

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

    // Sottoscrizione per label 'menu.usersList'
    this.translocoService.selectTranslate('menu.usersList').subscribe(usersListLabel => {
      this.usersListLabel = usersListLabel;
      this.updateMenuItems();
    });
  }

  updateMenuItems(): void {
    if (this.dashboardLabel && this.usersListLabel && this.loginLabel) {
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
          label: this.usersListLabel,
          icon: 'pi pi-fw pi-users',
          command: () => this.navigateToUsersList()
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

  navigateToUsersList(): void {
    this.router.navigateByUrl('/usersList');
  }
}

