import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';

export interface Courier {
  id: number;
  name: string;
  phone: string;
  zone: string;
  deliveries: number;
  rating: number;
  status: 'Actif' | 'Inactif';
}

@Component({
  selector: 'app-couriers-list',
  imports: [NgForOf],
  standalone: true,
  templateUrl: './couriers-list.html',
  styleUrls: ['./couriers-list.css']
})
export class CouriersComponent {

  couriers: Courier[] = [
    {
      id: 1,
      name: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
      zone: 'Paris Centre',
      deliveries: 12,
      rating: 4.8,
      status: 'Actif'
    },
    {
      id: 2,
      name: 'Marie Martin',
      phone: '+33 6 98 76 54 32',
      zone: 'Paris Nord',
      deliveries: 8,
      rating: 4.9,
      status: 'Actif'
    },
    {
      id: 3,
      name: 'Pierre Bernard',
      phone: '+33 6 11 22 33 44',
      zone: 'Paris Sud',
      deliveries: 15,
      rating: 4.5,
      status: 'Inactif'
    },
    {
      id: 4,
      name: 'Sophie Dubois',
      phone: '+33 6 55 66 77 88',
      zone: 'Paris Est',
      deliveries: 10,
      rating: 4.7,
      status: 'Actif'
    }
  ];

  addCourier() {
    console.log('Ajouter un livreur');
  }

  viewCourier(courier: Courier) {
    console.log('Voir', courier);
  }

  editCourier(courier: Courier) {
    console.log('Modifier', courier);
  }

  deleteCourier(courier: Courier) {
    console.log('Supprimer', courier);
  }
}
