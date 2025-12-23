import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import du FormsModule
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
  imports: [MapComponent, FormsModule], // Ajoutez FormsModule ici
  templateUrl: './live-tracking.html',
  styleUrls: ['./live-tracking.css']
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) private mapComponent!: MapComponent;

  allDeliveries: Delivery[] = [];
  filteredDeliveries: Delivery[] = [];
  mapPoints: MapPoint[] = [];
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
      // ... votre liste de deliveries
      {
    id: 'D001',
    customerName: 'Emmanuel Ngu',
    address: 'Rue Ekoudou, Douala, Littoral, Cameroun',
    phone: '+237 676 123 456',
    openingHours: '8h - 18h',
    duration: '30 min',
    timeSlot: '10h - 12h',
    estimatedTime: '11h',
    status: 'on-time',
    latitude: 4.0511,
    longitude: 9.7043
  },
  {
    id: 'D002',
    customerName: 'Grace Nkongho',
    address: 'Bvd. Dad Chuy, Yaoundé, Centre, Cameroun',
    phone: '+237 650 789 012',
    openingHours: '8h - 17h',
    duration: '45 min',
    timeSlot: '14h - 15h',
    estimatedTime: '14h30',
    status: 'late',
    latitude: 3.8480,
    longitude: 11.5021
  },
  {
    id: 'D003',
    customerName: 'Samuel Mbarga',
    address: 'Route de Bonanjo, Douala, Littoral, Cameroun',
    phone: '+237 694 321 654',
    openingHours: '7h - 19h',
    duration: '20 min',
    timeSlot: '11h - 11h30',
    estimatedTime: '11h15',
    status: 'completed',
    latitude: 4.0604,
    longitude: 9.7026
  },
  {
    id: 'D004',
    customerName: 'Marie Tchatchouang',
    address: 'Av. de la Réunification, Yaoundé, Centre, Cameroun',
    phone: '+237 699 876 543',
    openingHours: '8h - 20h',
    duration: '15 min',
    timeSlot: '16h - 16h15',
    estimatedTime: '16h',
    status: 'cancelled',
    latitude: 3.8760,
    longitude: 11.5021
  }
    ];
    this.applyFilters();
  }


  private setupAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => this.refreshData());
  }

  public refreshData(): void {
    console.log('Données rafraîchies');
    this.applyFilters(); // Met à jour la liste et la carte
    
  }

  onSearchInput(): void {
    this.applyFilters();
  }

  setFilterType(type: 'all' | 'zone' | 'name'): void {
    this.selectedFilter = type;
    this.applyFilters();
  }

  // Modifier ici : rendre la méthode publique
  public applyFilters(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredDeliveries = this.allDeliveries.filter(d => {
      const name = d.customerName.toLowerCase();
      const address = d.address.toLowerCase();

      if (this.selectedFilter === 'zone') {
        return address.includes(term);
      } else if (this.selectedFilter === 'name') {
        return name.includes(term);
      } else {
        return name.includes(term) || address.includes(term);
      }
    });
   //console.log( this.filteredDeliveries.length);
   //console.log(this.applyFilters())
    this.updateMapPoints();
  }
//nombres de livreurs en activité filtrées

 private  getFilteredDeliveriesLength(filteredDeliveries: Delivery[]): number {
  return this.filteredDeliveries.length;
  console.log(this.filteredDeliveries.length);
}


  private updateMapPoints(): void {
    this.mapPoints = this.filteredDeliveries
      .filter(d => d.latitude != null && d.longitude != null)
      .map(d => {
        let status: MapPoint['status'] = 'pending';

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

  zoomIn(): void { this.mapComponent?.zoomIn(); }
  zoomOut(): void { this.mapComponent?.zoomOut(); }
  centerMap(): void { this.mapComponent?.centerMap(); }

  private getCurrentDeliveryId(): string | null {
    return null;
  }
}