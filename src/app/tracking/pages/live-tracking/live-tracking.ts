/*import { Component } from '@angular/core';

@Component({
  selector: 'app-live-tracking',
  imports: [],
  templateUrl: './live-tracking.html',
  styleUrl: './live-tracking.css',
})
export class LiveTracking {

}*/
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ajout pour *ngIf, *ngFor etc.
import { interval, Subscription } from 'rxjs';

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
  proofs?: {
    photo: boolean;
    signature: boolean;
  };
}

@Component({
  selector: 'app-live-tracking', // Corrigé pour correspondre à l'usage général
  standalone: true, // Ajout pour l'architecture standalone
  imports: [CommonModule], // Ajout pour les directives
  templateUrl: './live-tracking.html', // Corrigé pour pointer vers le bon fichier
  styleUrls: ['./live-tracking.css'] // Corrigé pour pointer vers le bon fichier
})
export class DeliveryTrackingComponent implements OnInit, OnDestroy {
  // ... TOUT LE RESTE DE TON CODE RESTE INCHANGÉ ...
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  // Driver and Tournee Information
  driverName: string = 'Julia Fernandez';
  tourneeProgress: number = 7.69;
  startTime: string = '08:00';
  endTime: string = '17:39';
  startDate: string = '21/03/2023 11:55';
  totalDistance: number = 12.23;
  totalStops: number = 13;

  // Status Counts
  onTimeCount: number = 0;
  lateCount: number = 12;
  completedCount: number = 1;
  cancelledCount: number = 0;

  // Current Delivery
  currentDelivery: Delivery | null = null;

  // Upcoming Deliveries
  upcomingDeliveries: Delivery[] = [];

  // All Deliveries
  allDeliveries: Delivery[] = [];

  // Subscriptions
  private refreshSubscription?: Subscription;

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

  /**
   * Initialize mock delivery data
   */
  private initializeDeliveries(): void {
    this.allDeliveries = [
      {
        id: '11554989',
        customerName: 'John Gates',
        address: '8 Glade Path, London SE1 8EG, United-Kingdom',
        phone: '+33612345678',
        openingHours: 'Toujours ouvert',
        duration: '25min',
        timeSlot: '08:00 ↔ 17:00',
        estimatedTime: '08:45',
        status: 'on-time',
        latitude: 51.5074,
        longitude: -0.1278,
        proofs: {
          photo: true,
          signature: true
        }
      },
      {
        id: '11554990',
        customerName: 'Sarah Johnson',
        address: '42 Baker Street, London NW1 6XE, United-Kingdom',
        phone: '+33612345679',
        openingHours: '09:00 - 18:00',
        duration: '20min',
        timeSlot: '09:00 ↔ 17:00',
        estimatedTime: '09:30',
        status: 'late',
        latitude: 51.5238,
        longitude: -0.1585,
        proofs: {
          photo: false,
          signature: false
        }
      },
      {
        id: '11554991',
        customerName: 'Michael Brown',
        address: '15 Oxford Street, London W1D 1BS, United-Kingdom',
        phone: '+33612345680',
        openingHours: '08:00 - 20:00',
        duration: '30min',
        timeSlot: '10:00 ↔ 18:00',
        estimatedTime: '10:45',
        status: 'late',
        latitude: 51.5155,
        longitude: -0.1426
      },
      {
        id: '11554992',
        customerName: 'Emma Wilson',
        address: '78 Piccadilly, London W1J 8HP, United-Kingdom',
        phone: '+33612345681',
        openingHours: '10:00 - 19:00',
        duration: '15min',
        timeSlot: '11:00 ↔ 16:00',
        estimatedTime: '11:30',
        status: 'late',
        latitude: 51.5074,
        longitude: -0.1419
      },
      {
        id: '11554993',
        customerName: 'David Lee',
        address: '23 Regent Street, London W1B 5AH, United-Kingdom',
        phone: '+33612345682',
        openingHours: '09:00 - 21:00',
        duration: '25min',
        timeSlot: '12:00 ↔ 17:00',
        estimatedTime: '12:15',
        status: 'late',
        latitude: 51.5112,
        longitude: -0.1339
      }
    ];

    // Set current delivery (first in list)
    this.currentDelivery = this.allDeliveries[0];

    // Set upcoming deliveries (remaining)
    this.upcomingDeliveries = this.allDeliveries.slice(1, 4);

    this.updateStatusCounts();
  }

  /**
   * Update status counts based on all deliveries
   */
  private updateStatusCounts(): void {
    this.onTimeCount = this.allDeliveries.filter(d => d.status === 'on-time').length;
    this.lateCount = this.allDeliveries.filter(d => d.status === 'late').length;
    this.completedCount = this.allDeliveries.filter(d => d.status === 'completed').length;
    this.cancelledCount = this.allDeliveries.filter(d => d.status === 'cancelled').length;
  }

  /**
   * Setup auto-refresh for real-time updates
   */
  private setupAutoRefresh(): void {
    // Refresh every 30 seconds
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.refreshData();
    });
  }

  /**
   * Refresh delivery data
   */
  refreshData(): void {
    console.log('Refreshing delivery data...');
    // In a real app, this would call an API
    // For now, we'll simulate by updating progress
    if (this.tourneeProgress < 100) {
      this.tourneeProgress = Math.min(100, this.tourneeProgress + 5);
    }
    
    // Simulate real-time updates
    this.simulateRealTimeUpdates();
  }

  /**
   * Simulate real-time updates (in a real app, this would come from WebSocket or API polling)
   */
  private simulateRealTimeUpdates(): void {
    // Update estimated times randomly
    this.allDeliveries.forEach(delivery => {
      if (delivery.status !== 'completed' && delivery.status !== 'cancelled') {
        const currentTime = new Date();
        const minutes = Math.floor(Math.random() * 30) + 10;
        currentTime.setMinutes(currentTime.getMinutes() + minutes);
        delivery.estimatedTime = currentTime.toTimeString().substring(0, 5);
      }
    });
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'on-time': 'À l\'heure',
      'late': 'En retard',
      'completed': 'Livrée',
      'cancelled': 'Annulée'
    };
    return labels[status] || status;
  }

  /**
   * Complete a delivery
   */
  completeDelivery(delivery: Delivery): void {
    console.log('Completing delivery:', delivery.id);
    delivery.status = 'completed';
    
    // Move to next delivery
    const currentIndex = this.allDeliveries.findIndex(d => d.id === delivery.id);
    if (currentIndex < this.allDeliveries.length - 1) {
      this.currentDelivery = this.allDeliveries[currentIndex + 1];
      this.upcomingDeliveries = this.allDeliveries.slice(currentIndex + 2, currentIndex + 5);
    } else {
      this.currentDelivery = null;
      this.upcomingDeliveries = [];
    }

    // Update progress
    const completedDeliveries = this.allDeliveries.filter(d => d.status === 'completed').length;
    this.tourneeProgress = (completedDeliveries / this.allDeliveries.length) * 100;

    this.updateStatusCounts();

    // In a real app, this would call an API to update the backend
    this.saveDeliveryStatus(delivery);
  }

  /**
   * Save delivery status to backend (mock)
   */
  private saveDeliveryStatus(delivery: Delivery): void {
    console.log('Saving delivery status to backend:', delivery);
    // API call would go here
  }

  /**
   * View delivery on map
   */
  viewOnMap(delivery: Delivery): void {
    console.log('Viewing delivery on map:', delivery);
    // In a real app, this would center the map on the delivery location
    if (delivery.latitude && delivery.longitude) {
      this.centerMapOnLocation(delivery.latitude, delivery.longitude);
    }
  }

  /**
   * Center map on specific location
   */
  private centerMapOnLocation(lat: number, lng: number): void {
    console.log(`Centering map on: ${lat}, ${lng}`);
    // Map centering logic would go here
    // This would typically use a map library like Leaflet or Google Maps
  }

  /**
   * Toggle view options
   */
  toggleViewOptions(): void {
    console.log('Toggling view options');
    // This would open a modal or dropdown with display options
  }

  /**
   * Zoom in on map
   */
  zoomIn(): void {
    console.log('Zooming in');
    // Map zoom logic would go here
  }

  /**
   * Zoom out on map
   */
  zoomOut(): void {
    console.log('Zooming out');
    // Map zoom logic would go here
  }

  /**
   * Center map on current location
   */
  centerMap(): void {
    console.log('Centering map');
    // Map centering logic would go here
    if (this.currentDelivery?.latitude && this.currentDelivery?.longitude) {
      this.centerMapOnLocation(this.currentDelivery.latitude, this.currentDelivery.longitude);
    }
  }

  /**
   * Add delivery (for admin use)
   */
  addDelivery(delivery: Delivery): void {
    this.allDeliveries.push(delivery);
    this.updateStatusCounts();
    
    if (!this.currentDelivery) {
      this.currentDelivery = delivery;
    } else if (this.upcomingDeliveries.length < 3) {
      this.upcomingDeliveries.push(delivery);
    }
  }

  /**
   * Cancel delivery
   */
  cancelDelivery(delivery: Delivery): void {
    delivery.status = 'cancelled';
    this.updateStatusCounts();
    console.log('Delivery cancelled:', delivery.id);
  }

  /**
   * Get delivery by ID
   */
  getDeliveryById(id: string): Delivery | undefined {
    return this.allDeliveries.find(d => d.id === id);
  }

  /**
   * Filter deliveries by status
   */
  getDeliveriesByStatus(status: 'on-time' | 'late' | 'completed' | 'cancelled'): Delivery[] {
    return this.allDeliveries.filter(d => d.status === status);
  }

  /**
   * Calculate total distance for remaining deliveries
   */
  getRemainingDistance(): number {
    // This would calculate based on coordinates in a real app
    const remainingDeliveries = this.allDeliveries.filter(
      d => d.status !== 'completed' && d.status !== 'cancelled'
    );
    return remainingDeliveries.length * 2; // Mock calculation
  }

  /**
   * Get estimated completion time
   */
  getEstimatedCompletionTime(): string {
    const remainingDeliveries = this.allDeliveries.filter(
      d => d.status !== 'completed' && d.status !== 'cancelled'
    );
    
    // Calculate total remaining time (mock)
    const totalMinutes = remainingDeliveries.length * 25; // Average 25 min per delivery
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + totalMinutes);
    
    return currentTime.toTimeString().substring(0, 5);
  }
}