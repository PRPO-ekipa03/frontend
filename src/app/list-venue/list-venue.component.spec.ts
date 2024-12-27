import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVenueComponent } from './list-venue.component';

describe('ListVenueComponent', () => {
  let component: ListVenueComponent;
  let fixture: ComponentFixture<ListVenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListVenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
