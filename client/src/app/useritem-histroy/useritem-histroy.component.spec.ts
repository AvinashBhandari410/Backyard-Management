import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseritemHistroyComponent } from './useritem-histroy.component';

describe('UseritemHistroyComponent', () => {
  let component: UseritemHistroyComponent;
  let fixture: ComponentFixture<UseritemHistroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseritemHistroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseritemHistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
