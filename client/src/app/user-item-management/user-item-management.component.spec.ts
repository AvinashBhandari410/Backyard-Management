import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemManagementComponent } from './user-item-management.component';

describe('UserItemManagementComponent', () => {
  let component: UserItemManagementComponent;
  let fixture: ComponentFixture<UserItemManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserItemManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserItemManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
