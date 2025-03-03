import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoModule, TranslocoTestingModule } from '@ngneat/transloco';
import { SharedModule } from '../../../shared/shared.module';


describe('LoginComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        TranslocoModule,
        SharedModule,
        TranslocoTestingModule
      ],
      declarations: [LoginComponent],
      providers: [AuthService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
