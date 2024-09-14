import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselMinComponent } from './carousel-min.component';

describe('CarouselMinComponent', () => {
  let component: CarouselMinComponent;
  let fixture: ComponentFixture<CarouselMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CarouselMinComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(CarouselMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
