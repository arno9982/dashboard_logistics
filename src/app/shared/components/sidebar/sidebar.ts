import { Component } from '@angular/core';
import { NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  iconType: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  menu: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', iconType: 'dashboard' },
    { label: 'Livraisons', route: '/deliveries', iconType: 'package' },
    { label: 'Livreurs', route: '/couriers', iconType: 'users' },
    { label: 'Suivi temps réel', route: '/tracking', iconType: 'navigation' },
    { label: 'Rapports', route: '/reports', iconType: 'chart' }
  ];
}
