import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMangementComponent } from './item-mangement.component';

describe('ItemMangementComponent', () => {
  let component: ItemMangementComponent;
  let fixture: ComponentFixture<ItemMangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
