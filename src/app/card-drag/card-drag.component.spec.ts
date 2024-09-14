import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDragComponent } from './card-drag.component';

describe('CardDragComponent', () => {
  let component: CardDragComponent;
  let fixture: ComponentFixture<CardDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CardDragComponent]
})
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
