import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Importer les TYPES de Leaflet pour que TypeScript soit satisfait.
// Cela n'exécute pas la bibliothèque côté serveur.
import type * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() points: MapPoint[] = [];
  @ViewChild('mapContainer', { static: true }) private mapContainer!: ElementRef;

  // Déclarer les propriétés avec les types Leaflet
  private map: L.Map | null = null;
  private markersLayer?: L.LayerGroup;
  private L?: typeof L; // Pour stocker la bibliothèque Leaflet une fois chargée

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.isBrowser) {
      // Charger dynamiquement la bibliothèque Leaflet côté client
      this.L = await import('leaflet');
      this.markersLayer = this.L.layerGroup();
      this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mettre à jour les marqueurs seulement si la carte et les points existent
    if (this.isBrowser && this.map && changes['points']) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    if (this.map || !this.L) return;

    this.map = this.L.map(this.mapContainer.nativeElement, {
      center: [51.5074, -0.1278],
      zoom: 12
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer?.addTo(this.map);
    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map || !this.points || !this.L || !this.markersLayer) return;
    
    this.markersLayer.clearLayers();

    if (this.points.length === 0) return;

    const iconOptions = {
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41] as [number, number],
      iconAnchor: [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize: [41, 41] as [number, number]
    };
    const icons = {
      completed: this.L.icon({ ...iconOptions, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' }),
      current: this.L.icon({ ...iconOptions, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png' }),
      pending: this.L.icon({ ...iconOptions, iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png' })
    };

    const markerBounds = this.L.latLngBounds([]);
    this.points.forEach(point => {
      const marker = this.L!.marker([point.latitude, point.longitude], {
        icon: icons[point.status] || icons.pending
      }).bindTooltip(point.tooltip);
      
      this.markersLayer?.addLayer(marker);
      markerBounds.extend([point.latitude, point.longitude]);
    });

    this.map.fitBounds(markerBounds, { padding: [50, 50] });
  }

  public zoomIn = (): void => { this.map?.zoomIn(); }
  public zoomOut = (): void => { this.map?.zoomOut(); }
  public centerMap = (): void => {
    if (!this.map || !this.L) return;
    const currentPoint = this.points.find(p => p.status === 'current');
    if (currentPoint) {
      this.map.setView([currentPoint.latitude, currentPoint.longitude], 15);
    } else if (this.points.length > 0) {
      const bounds = this.L.latLngBounds(this.points.map(p => [p.latitude, p.longitude]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  };
}

// L'interface MapPoint reste en dehors du composant
export interface MapPoint {
  latitude: number;
  longitude: number;
  tooltip: string;
  status: 'completed' | 'current' | 'pending';
}