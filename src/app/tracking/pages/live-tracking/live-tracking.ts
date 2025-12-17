import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
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
  imports: [CommonModule, MapComponent],
  templateUrl: './live-tracking.html',
  styleUrls: ['./live-tracking.css']
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) private mapComponent!: MapComponent;
  
  // Données de la page
  driverName: string = 'Julia Fernandez';
  tourneeProgress: number = 7.69;
  startTime: string = '08:00';
  endTime: string = '17:39';
  startDate: string = '21/03/2023 11:55';
  totalDistance: number = 12.23;
  totalStops: number = 13;
  onTimeCount: number = 0;
  lateCount: number = 12;
  completedCount: number = 1;
  cancelledCount: number = 0;
  currentDelivery: Delivery | null = null;
  upcomingDeliveries: Delivery[] = [];
  allDeliveries: Delivery[] = [];
  private refreshSubscription?: Subscription;

  // Données pour la carte
  mapPoints: MapPoint[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initializeDeliveries();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private initializeDeliveries(): void {
    this.allDeliveries = [
      { id: '11554989', customerName: 'John Gates', address: '8 Glade Path, London SE1 8EG, UK', phone: '+33612345678', openingHours: 'Toujours ouvert', duration: '25min', timeSlot: '08:00 ↔ 17:00', estimatedTime: '08:45', status: 'on-time', latitude: 51.5074, longitude: -0.1278 },
      { id: '11554990', customerName: 'Sarah Johnson', address: '42 Baker Street, London NW1 6XE, UK', phone: '+33612345679', openingHours: '09:00 - 18:00', duration: '20min', timeSlot: '09:00 ↔ 17:00', estimatedTime: '09:30', status: 'late', latitude: 51.5238, longitude: -0.1585 },
      { id: '11554991', customerName: 'Michael Brown', address: '15 Oxford Street, London W1D 1BS, UK', phone: '+33612345680', openingHours: '08:00 - 20:00', duration: '30min', timeSlot: '10:00 ↔ 18:00', estimatedTime: '10:45', status: 'late', latitude: 51.5155, longitude: -0.1426 },
      { id: '11554992', customerName: 'Emma Wilson', address: '78 Piccadilly, London W1J 8HP, UK', phone: '+33612345681', openingHours: '10:00 - 19:00', duration: '15min', timeSlot: '11:00 ↔ 16:00', estimatedTime: '11:30', status: 'late', latitude: 51.5074, longitude: -0.1419 },
      { id: '11554993', customerName: 'David Lee', address: '23 Regent Street, London W1B 5AH, UK', phone: '+33612345682', openingHours: '09:00 - 21:00', duration: '25min', timeSlot: '12:00 ↔ 17:00', estimatedTime: '12:15', status: 'late', latitude: 51.5112, longitude: -0.1339 }
    ];
    this.currentDelivery = this.allDeliveries[0];
    this.upcomingDeliveries = this.allDeliveries.slice(1, 4);
    this.updateStatusCounts();
    this.updateMapPoints();
  }

  private updateMapPoints(): void {
    this.mapPoints = this.allDeliveries
      .filter(d => d.latitude != null && d.longitude != null)
      .map(d => {
        let status: MapPoint['status'] = 'pending';
        if (d.id === this.currentDelivery?.id) {
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

  completeDelivery(delivery: Delivery): void {
    delivery.status = 'completed';
    const currentIndex = this.allDeliveries.findIndex(d => d.id === delivery.id);
    if (currentIndex > -1 && currentIndex < this.allDeliveries.length - 1) {
      this.currentDelivery = this.allDeliveries[currentIndex + 1];
    } else {
      this.currentDelivery = null;
    }
    this.updateStatusCounts();
    this.updateMapPoints();
  }

  // Fonctions pour contrôler la carte
  zoomIn(): void { this.mapComponent?.zoomIn(); }
  zoomOut(): void { this.mapComponent?.zoomOut(); }
  centerMap(): void { this.mapComponent?.centerMap(); }

  // --- Autres méthodes de la page (inchangées) ---
  private updateStatusCounts(): void {
    this.onTimeCount = this.allDeliveries.filter(d => d.status === 'on-time').length;
    this.lateCount = this.allDeliveries.filter(d => d.status === 'late').length;
    this.completedCount = this.allDeliveries.filter(d => d.status === 'completed').length;
    this.cancelledCount = this.allDeliveries.filter(d => d.status === 'cancelled').length;
  }
  private setupAutoRefresh(): void {
    this.refreshSubscription = interval(30000).subscribe(() => this.refreshData());
  }
  refreshData(): void { /* ... */ }
  private simulateRealTimeUpdates(): void { /* ... */ }
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = { 'on-time': 'À l\'heure', 'late': 'En retard', 'completed': 'Livrée', 'cancelled': 'Annulée' };
    return labels[status] || status;
  }
}