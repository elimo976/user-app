import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponent } from './user-detail.component';
import { DialogModule } from 'primeng/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [
        DialogModule,
        HttpClientTestingModule,
        SharedModule,
        TranslocoModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
