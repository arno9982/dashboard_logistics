import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  user = {
    name: 'Arno Tsague',
    role: 'Admin'
  };
  notificationsCount = 3;
  systemStatus = 'online';
  showUserMenu = false;
  showNotifications = false;
  currentRoute = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
  }

  toggleSidebar() {
    // Logic for mobile sidebar toggle
    const sidebar = document.querySelector('app-sidebar');
    sidebar?.classList.toggle('open');
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Tableau de bord',
      '/deliveries': 'Gestion des livraisons',
      '/couriers': 'Gestion des livreurs',
      '/tracking': 'Suivi en temps réel',
      '/reports': 'Rapports et statistiques'
    };
    return titles[this.currentRoute] || 'Dashboard Logistique';
  }
}

