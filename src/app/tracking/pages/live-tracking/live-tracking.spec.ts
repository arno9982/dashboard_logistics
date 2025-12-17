import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { LiveTracking } from './live-tracking';
import {DeliveryTrackingComponent} from "./live-tracking"
describe('LiveTracking', () => {
  let component: DeliveryTrackingComponent;
  let fixture: ComponentFixture<DeliveryTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryTrackingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
