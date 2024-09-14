import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMinComponent } from './card-min.component';

describe('CardMinComponent', () => {
  let component: CardMinComponent;
  let fixture: ComponentFixture<CardMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CardMinComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
