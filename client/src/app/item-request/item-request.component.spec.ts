import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRequestComponent } from './item-request.component';

describe('ItemRequestComponent', () => {
  let component: ItemRequestComponent;
  let fixture: ComponentFixture<ItemRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
