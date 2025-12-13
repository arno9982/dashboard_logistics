import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  stats = {
    readyToShip: 24,
    inTransit: 15,
    delivered: 142,
    failed: 3,
    activeDeliverers: 8
  };

  recentActivities = [
    {
      type: 'success',
      title: 'Livraison réussie',
      description: 'CMD-2024-003 livrée par Marie Martin',
      time: 'Il y a 2 minutes'
    },
    {
      type: 'info',
      title: 'Nouvelle commande',
      description: 'CMD-2024-005 assignée à Jean Dupont',
      time: 'Il y a 15 minutes'
    },
    {
      type: 'warning',
      title: 'Retard signalé',
      description: 'CMD-2024-001 en retard de 20 minutes',
      time: 'Il y a 30 minutes'
    }
  ];

  topDeliverers = [
    { name: 'Marie Martin', deliveries: 45, rating: 4.9 },
    { name: 'Jean Dupont', deliveries: 38, rating: 4.8 },
    { name: 'Sophie Dubois', deliveries: 32, rating: 4.7 }
  ];
}
