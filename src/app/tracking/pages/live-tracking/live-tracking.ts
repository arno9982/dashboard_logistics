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
      { id: 'CM2025001', customerName: 'Jean Dupont', address: 'Rue de la Joie, Akwa, Douala', phone: '+237699887766', openingHours: '08:00 - 18:00', duration: '30min', timeSlot: '09:00 ↔ 12:00', estimatedTime: '09:15', status: 'on-time', latitude: 4.0483, longitude: 9.7043 },
      { id: 'CM2025002', customerName: 'Amina Bello', address: 'Boulevard de la Liberté, Bonapriso, Douala', phone: '+237677665544', openingHours: 'Toujours ouvert', duration: '20min', timeSlot: '09:00 ↔ 17:00', estimatedTime: '10:30', status: 'late', latitude: 4.0325, longitude: 9.7006 },
      { id: 'CM2025003', customerName: 'Paul Atanga', address: 'Avenue Kennedy, Centre Ville, Yaoundé', phone: '+237655443322', openingHours: '10:00 - 20:00', duration: '45min', timeSlot: '11:00 ↔ 18:00', estimatedTime: '11:45', status: 'late', latitude: 3.8480, longitude: 11.5021 },
      { id: 'CM2025004', customerName: 'Chantal Biya', address: 'Rue des Ambassades, Bastos, Yaoundé', phone: '+237666554433', openingHours: '09:00 - 16:00', duration: '25min', timeSlot: '14:00 ↔ 16:00', estimatedTime: '14:20', status: 'late', latitude: 3.8925, longitude: 11.5085 },
      { id: 'CM2025005', customerName: 'Samuel Eto\'o', address: 'Down Beach, Limbe', phone: '+237654321098', openingHours: '10:00 - 22:00', duration: '35min', timeSlot: '15:00 ↔ 17:00', estimatedTime: '16:00', status: 'late', latitude: 4.0156, longitude: 9.2149 }
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