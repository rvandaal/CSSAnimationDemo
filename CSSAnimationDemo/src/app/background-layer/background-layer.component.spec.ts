import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundLayerComponent } from './background-layer.component';

describe('BackgroundLayerComponent', () => {
  let component: BackgroundLayerComponent;
  let fixture: ComponentFixture<BackgroundLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
