import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { DeliveriesList } from './deliveries-list';
import {DeliveriesListComponent} from './deliveries-list'
describe('DeliveriesList', () => {
  let component: DeliveriesListComponent;
  let fixture: ComponentFixture<DeliveriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveriesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveriesListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
