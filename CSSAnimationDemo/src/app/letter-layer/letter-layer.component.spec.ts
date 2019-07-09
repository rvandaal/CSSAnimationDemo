import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterLayerComponent } from './letter-layer.component';

describe('LetterLayerComponent', () => {
  let component: LetterLayerComponent;
  let fixture: ComponentFixture<LetterLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
