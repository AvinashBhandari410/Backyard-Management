import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentSoldItemsComponent } from './recent-sold-items.component';

describe('RecentSoldItemsComponent', () => {
  let component: RecentSoldItemsComponent;
  let fixture: ComponentFixture<RecentSoldItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentSoldItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentSoldItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
