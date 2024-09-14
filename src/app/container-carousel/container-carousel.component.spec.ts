import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerCarouselComponent } from './container-carousel.component';

describe('ContainerCarouselComponent', () => {
  let component: ContainerCarouselComponent;
  let fixture: ComponentFixture<ContainerCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContainerCarouselComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(ContainerCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
