import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { MapComponent, MapPoint } from '../../components/MapComponent/map.component';

interface Delivery {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  openingHours: string;
  duration: string;
  timeSlot: string;
  estimatedTime: string;
  status: 'on-time' | 'late' | 'completed' | 'cancelled';
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-live-tracking',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './live-tracking.html',
  styleUrls: ['./live-tracking.css']
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) private mapComponent!: MapComponent;

  // Liste complète des livraisons
  allDeliveries: Delivery[] = [];

  // Liste filtrée utilisée pour la recherche, l'affichage et la carte
  filteredDeliveries: Delivery[] = [];
  mapPoints: MapPoint[] = [];

  // Gestion du filtre et saisie recherche
  searchTerm: string = '';
  selectedFilter: 'all' | 'zone' | 'name' = 'all';

  private refreshSubscription?: Subscription;

  ngOnInit(): void {
    this.initializeDeliveries();
    this.setupAutoRefresh();
    this.applyFilters(); // Initial
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private initializeDeliveries(): void {
    this.allDeliveries = [
      {
        id: 'CM2025001',
        customerName: 'Jean Dupont',
        address: 'Rue de la Joie, Akwa, Douala',
        phone: '+237699887766',
        openingHours: '08:00 - 18:00',
        duration: '30min',
        timeSlot: '09:00 ↔ 12:00',
        estimatedTime: '09:15',
        status: 'on-time',
        latitude: 4.0483,
        longitude: 9.7043
      },
      {
        id: 'CM2025002',
        customerName: 'Amina Bello',
        address: 'Boulevard de la Liberté, Bonapriso, Douala',
        phone: '+237677665544',
        openingHours: 'Toujours ouvert',
        duration: '20min',
        timeSlot: '09:00 ↔ 17:00',
        estimatedTime: '10:30',
        status: 'late',
        latitude: 4.0325,
        longitude: 9.7006
      },
      {
        id: 'CM2025003',
        customerName: 'Paul Atanga',
        address: 'Avenue Kennedy, Centre Ville, Yaoundé',
        phone: '+237655443322',
        openingHours: '10:00 - 20:00',
        duration: '45min',
        timeSlot: '11:00 ↔ 18:00',
        estimatedTime: '11:45',
        status: 'late',
        latitude: 3.8480,
        longitude: 11.5021
      },
      {
        id: 'CM2025004',
        customerName: 'Chantal Biya',
        address: 'Rue des Ambassades, Bastos, Yaoundé',
        phone: '+237666554433',
        openingHours: '09:00 - 16:00',
        duration: '25min',
        timeSlot: '14:00 ↔ 16:00',
        estimatedTime: '14:20',
        status: 'late',
        latitude: 3.8925,
        longitude: 11.5085
      },
      {
        id: 'CM2025005',
        customerName: 'Samuel Eto\'o',
        address: 'Down Beach, Limbe',
        phone: '+237654321098',
        openingHours: '10:00 - 22:00',
        duration: '35min',
        timeSlot: '15:00 ↔ 17:00',
        estimatedTime: '16:00',
        status: 'late',
        latitude: 4.0156,
        longitude: 9.2149
      }
    ];
    // Appliquer immédiatement le filtre (initialisé)
    this.applyFilters();
  }

  private setupAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => this.refreshData());
  }

  public refreshData(): void {
    // Ici, vous pouvez rafraîchir la liste si nécessaire
    console.log('Données rafraîchies');
    this.applyFilters(); // Met à jour la liste et la carte
  }

  // Quand l'utilisateur entre dans le champ de recherche
  onSearchInput(): void {
    this.applyFilters();
  }

  // Lors du changement de filtre (all, zone, nom)
  setFilterType(type: 'all' | 'zone' | 'name'): void {
    this.selectedFilter = type;
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.toLowerCase();

    // Filtrage basé sur le type sélectionné
    this.filteredDeliveries = this.allDeliveries.filter(d => {
      const name = d.customerName.toLowerCase();
      const address = d.address.toLowerCase();

      if (this.selectedFilter === 'zone') {
        return address.includes(term);
      } else if (this.selectedFilter === 'name') {
        return name.includes(term);
      } else {
        // 'all'
        return name.includes(term) || address.includes(term);
      }
    });
    this.updateMapPoints(); // Mise à jour des points pour la carte en fonction du filtre
  }

  private updateMapPoints(): void {
    this.mapPoints = this.filteredDeliveries
      .filter(d => d.latitude != null && d.longitude != null)
      .map(d => {
        let status: MapPoint['status'] = 'pending';

        // Vous pouvez ajouter votre logique si nécessaire pour différencier les points actuels, terminés, etc.
        if (d.id === this.getCurrentDeliveryId()) {
          status = 'current';
        } else if (d.status === 'completed') {
          status = 'completed';
        }

        return {
          latitude: d.latitude!,
          longitude: d.longitude!,
          tooltip: `<b>${d.customerName}</b><br>${d.address}`,
          status: status
        };
      });
  }

  // Fonctions de contrôle de la carte
  zoomIn(): void { this.mapComponent?.zoomIn(); }
  zoomOut(): void { this.mapComponent?.zoomOut(); }
  centerMap(): void { this.mapComponent?.centerMap(); }

  // Optionnel : définir l'ID du flux actuel (si vous avez cette info)
  private getCurrentDeliveryId(): string | null {
    // Si vous avez une logique pour définir la livraison en cours
    // Par exemple : return this.currentDelivery?.id ?? null;
    return null; // ou un ID spécifique
  }
}