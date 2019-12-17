import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { OverlayModule} from '@angular/cdk/overlay';
import { HomeModule } from '../home/home.module';
import { LoginModule } from '../login/login.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService as AuthGuard } from '../services/auth-guard.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TrustionInterceptor } from '../trustion.interceptor';
import {
  TOKEN_BASEPATH_MANAGER,
  TOKEN_BASEPATH_AUTH,
  TOKEN_BASEPATH_AUTH_TOKEN } from '../shared/constants';

// Import for i18n
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt, 'pt');

// Import for Environments
import { AppConfigService } from './_core/_environments/app.config.service';
import { AppConfig } from './app.config';

export function initializeApp(appConfigService: AppConfigService) {
  return (): Promise<any> => {
    return appConfigService.load();
  };
}

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    HomeModule,
    LoginModule,
    HttpClientModule,
    OverlayModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        skipWhenExpired: true
      }
    }),
  ],
  providers: [
    AppConfigService,
    AppConfig,
    AuthGuard,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TrustionInterceptor, multi: true },
    { provide: TOKEN_BASEPATH_MANAGER, useValue: 'trustion-digital-api'},
    { provide: TOKEN_BASEPATH_AUTH, useValue: 'auth/authorities'},
    { provide: TOKEN_BASEPATH_AUTH_TOKEN, useValue: 'oauth/token'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
