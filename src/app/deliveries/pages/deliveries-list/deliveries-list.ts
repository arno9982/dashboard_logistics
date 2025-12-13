// src/app/deliveries/pages/deliveries-list/deliveries-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Delivery {
  id: string;
  commande_id: string;
  client_nom: string;
  client_telephone: string;
  zone: string;
  adresse: string;
  montant: number;
  livreur_nom?: string;
  statut: 'en_attente' | 'en_cours' | 'livree';
  date_assignation: Date;
}

@Component({
  selector: 'app-deliveries-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deliveries-list.html',
  styleUrls: ['./deliveries-list.css']
})
export class DeliveriesListComponent implements OnInit {
  deliveries: Delivery[] = [];
  filteredDeliveries: Delivery[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  stats = {
    en_attente: 2,
    en_cours: 1,
    livrees_aujourdhui: 1
  };

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries(): void {
    // Données mock
    this.deliveries = [
      {
        id: 'LIV-001',
        commande_id: 'CMD-2024-001',
        client_nom: 'Alice Rousseau',
        client_telephone: '+33 6 16 18 13 42',
        zone: 'Paris 15e',
        adresse: '15 Rue de la Paix, 75002 Paris',
        montant: 45.99,
        statut: 'en_attente',
        date_assignation: new Date('2024-12-13T14:30:00')
      },
      {
        id: 'LIV-002',
        commande_id: 'CMD-2024-002',
        client_nom: 'Thomas Laurent',
        client_telephone: '+33 6 16 98 13 42',
        zone: 'Paris 8e',
        adresse: '8 Avenue des Champs-Élysées, 75008 Paris',
        montant: 32.50,
        livreur_nom: 'Jean Dupont',
        statut: 'en_cours',
        date_assignation: new Date('2024-12-13T08:15:00')
      },
      {
        id: 'LIV-003',
        commande_id: 'CMD-2024-003',
        client_nom: 'Emma Petit',
        client_telephone: '+33 6 16 18 13 14',
        zone: 'Paris 5e',
        adresse: '22 Boulevard Saint-Michel, 75005 Paris',
        montant: 78.20,
        livreur_nom: 'Marie Martin',
        statut: 'livree',
        date_assignation: new Date('2024-12-13T07:00:00')
      },
      {
        id: 'LIV-004',
        commande_id: 'CMD-2024-004',
        client_nom: 'Lucas Moreau',
        client_telephone: '+33 6 23 42 13 42',
        zone: 'Paris 1er',
        adresse: '45 Rue de Rivoli, 75001 Paris',
        montant: 125.00,
        statut: 'en_attente',
        date_assignation: new Date('2024-12-13T10:00:00')
      }
    ];
    
    this.filteredDeliveries = this.deliveries;
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredDeliveries = this.deliveries;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredDeliveries = this.deliveries.filter(d => 
      d.commande_id.toLowerCase().includes(term) ||
      d.client_nom.toLowerCase().includes(term) ||
      d.zone.toLowerCase().includes(term) ||
      (d.livreur_nom && d.livreur_nom.toLowerCase().includes(term))
    );
  }

  onFilterChange(): void {
    console.log('Filtrer clicked');
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'livree': 'Livrée'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'en_attente': 'status-waiting',
      'en_cours': 'status-inprogress',
      'livree': 'status-delivered'
    };
    return classes[status] || '';
  }

  openAssignModal(delivery: Delivery): void {
    console.log('Assigner livreur pour:', delivery);
    alert(`Assigner un livreur pour la commande ${delivery.commande_id}`);
  }

  viewDetails(delivery: Delivery): void {
    console.log('Voir détails:', delivery);
    alert(`Détails de la commande ${delivery.commande_id}`);
  }

  exportDeliveries(): void {
    console.log('Export des livraisons');
    alert('Fonctionnalité d\'export à implémenter');
  }
}