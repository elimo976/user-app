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
  analyticsLabel: string = '';
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

    // Sottoscrizione per label 'menu.analytics'
    this.translocoService.selectTranslate('menu.analytics').subscribe(analyticsLabel => {
      this.analyticsLabel = analyticsLabel;
      this.updateMenuItems();
    });

    // Sottoscrizione per label 'menu.usersList'
    this.translocoService.selectTranslate('menu.usersList').subscribe(usersListLabel => {
      this.usersListLabel = usersListLabel;
      this.updateMenuItems();
    });
  }

  updateMenuItems(): void {
    if (this.analyticsLabel && this.usersListLabel && this.loginLabel) {
      this.items = [
        {
          label: this.loginLabel,
          icon: 'pi pi-fw pi-user',
          command: () => this.navigateToLogin()
        },
        {
          label: this.usersListLabel,
          icon: 'pi pi-fw pi-users',
          command: () => this.navigateToUsersList()
        },
        {
          label: this.analyticsLabel,
          icon: 'pi pi-fw pi-chart-line',
          command: () => this.navigateToAnalytics()
        }
      ];
    }
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  navigateToUsersList(): void {
    this.router.navigateByUrl('/usersList');
  }

  navigateToAnalytics(): void {
    this.router.navigateByUrl('/analytics');
  }
}

