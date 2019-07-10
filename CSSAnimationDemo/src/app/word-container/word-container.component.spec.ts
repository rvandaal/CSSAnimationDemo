import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordContainerComponent } from './word-container.component';

describe('WordContainerComponent', () => {
  let component: WordContainerComponent;
  let fixture: ComponentFixture<WordContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
