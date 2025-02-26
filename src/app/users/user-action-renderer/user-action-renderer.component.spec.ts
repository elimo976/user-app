import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActionRendererComponent } from './user-action-renderer.component';

describe('UserActionRendererComponent', () => {
  let component: UserActionRendererComponent;
  let fixture: ComponentFixture<UserActionRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserActionRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserActionRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
