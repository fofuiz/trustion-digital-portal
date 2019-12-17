import { Component, OnInit, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, Event, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AppConfig } from '../app/app.config';
import { OverlayContainer} from '@angular/cdk/overlay';
import { GlobalService } from '../services/global.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from '../services/login.service';
import { Login } from '../model/login';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppUi } from '../model/app-ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string;
  apiUrl: string;
  statusApi: string;
  private subscriptions = new Subscription();
  @HostBinding('class') componentCssClass;

  constructor(
    private appConfig: AppConfig,
    private http: HttpClient,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    public overlayContainer: OverlayContainer,
    private globalService: GlobalService,
    private loginService: LoginService
  ) {
    this.title = 'Trustion Digital';
    this.apiUrl = this.appConfig.settings.api.url;
  }

  ngOnInit(): void {
    this.initListeners();
    this.loginService.getAuthorities();
  }

  private initListeners() {
    this.registerOnTheme();
    this.registerOnChangeTheme();
    this.registerOnLoginInfo();
    this.registerOnLogout();
    this.registerOnErrorLoginInfo();
    this.registerOnRouterEvents();
  }

  registerOnRouterEvents() {
    this.subscriptions.add(
      this.router.events
      .subscribe((event: Event) => {
        if (event instanceof NavigationStart) {
          // Show loading indicator
          console.log('Navigation Start');
        }
        if (event instanceof NavigationEnd) {
          // Hide loading indicator
          console.log('Navigation End');
        }
        if (event instanceof NavigationError) {
          // Hide loading indicator
          // Present error to user
          console.log(event.error);
        }
      })
    );
  }

  registerOnTheme() {
    this.subscriptions.add(
      this.loginService.theme$.subscribe(
        (ui: AppUi) => {
          this.globalService.changeThemeSubject.next(ui.theme);
          window.setTimeout(() => {
            (document.getElementById('logoImage') as HTMLImageElement).src = ui.url;
          }, 100);
        }
      )
    );
  }

  registerOnChangeTheme() {
    this.subscriptions.add(
      this.globalService.changeTheme$.subscribe(
        (theme: string) => {
          window.setTimeout(() => {
            this.onSetTheme(theme);
          }, 100);
        }
      )
    );
  }

  registerOnLoginInfo() {
    this.subscriptions.add(
      this.loginService.loginInfo$.subscribe(
        (loginInfo: Login) => {
          if (loginInfo) {
            this.globalService.loginInfo = loginInfo;
            this.loginService.getCompanyUserInterface(loginInfo.userCompany);
            localStorage.setItem('access_token', loginInfo.token);
            this.router.navigate(['/home']);
          }
        }
      )
    );
  }

  registerOnLogout() {
    this.subscriptions.add(
      this.loginService.logout$.subscribe(
        (logout: {logged: boolean}) => {
          if (logout && !logout.logged) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_company');
            localStorage.removeItem('user_uuid');
            this.globalService.loginInfo = new Login();
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }

  registerOnErrorLoginInfo() {
    this.subscriptions.add(
      this.loginService.errorLoginInfo$.subscribe(
        (error: HttpErrorResponse) => {
          console.log(error.message);
        }
      )
    );
  }

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
