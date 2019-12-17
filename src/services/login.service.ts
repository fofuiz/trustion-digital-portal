import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { AppConfig } from '../app/app.config';
import { AppUi } from '../model/app-ui';
import { Login } from '../model/login';
import {
  TOKEN_BASEPATH_MANAGER,
  TOKEN_BASEPATH_AUTH,
  TOKEN_BASEPATH_AUTH_TOKEN } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // oauthTokenUrl: string;
  // urlAuthorities: string;
  jwtPayload: any;
  public companyUiList: Array<AppUi>;

  private loginInfoSubject = new Subject<object>();
  loginInfo$: Observable<object> = this.loginInfoSubject.asObservable();

  private logoutSubject = new Subject<object>();
  logout$: Observable<object> = this.logoutSubject.asObservable();

  private errorLoginInfoSubject = new Subject();
  errorLoginInfo$: Observable<any> = this.errorLoginInfoSubject.asObservable();

  private statusApiSubject = new Subject<string>();
  statusApi$: Observable<string> = this.statusApiSubject.asObservable();

  public themeSubject = new Subject<AppUi>();
  theme$: Observable<AppUi> = this.themeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private appConfig: AppConfig,
    private jwtHelper: JwtHelperService,
    @Inject(TOKEN_BASEPATH_MANAGER) private basePath: string,
    @Inject(TOKEN_BASEPATH_AUTH) private basePathAuth: string,
    @Inject(TOKEN_BASEPATH_AUTH_TOKEN) private basePathAuthToken: string
  ) {
    // this.oauthTokenUrl = this.appConfig.settings.api.oauth2UrlToken;
    // this.urlAuthorities = this.appConfig.settings.api.oauth2UrlAuthorities;
  }

  login(usuario: string, senha: string) {
    // tslint:disable-next-line: max-line-length
    const headerAuthorization = 'Basic UHJvamVjdFRydXN0aW9uRGlnaXRhbE9BdXRoMlNlY3VyaXR5OnNlY3JldFByb2plY3RUcnVzdGlvbkRpZ2l0YWxPQXV0aDJTZWN1cml0eQ==';
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
      .append('Authorization', headerAuthorization);
    const body = `username=${usuario}&password=${senha}&grant_type=password`;
    this.http.post<any>('@@' + `${this.basePath}/${this.basePathAuthToken}`, body, { headers })
      .subscribe((tokenInfo) => {
        this.getAuthorities(tokenInfo);
      },
      (error: Error) => {
        this.errorLoginInfoSubject.next(error);
      });
  }

  logout() {
    this.logoutSubject.next({logged: false});
  }

  getAuthorities(tokenInfo?) {
    let isValidToken: boolean;
    let login = new Login();
    if (!!tokenInfo) {
      localStorage.setItem('access_token', tokenInfo.access_token);
      localStorage.setItem('user_uuid', tokenInfo.user_uuid);
      localStorage.setItem('user_company', tokenInfo.user_company);
      login.token = tokenInfo.access_token;
      login.uuid = tokenInfo.user_uuid;
      login.userCompany = tokenInfo.user_company;
      isValidToken = true;
    } else {
      login.token = localStorage.getItem('access_token');
      login.uuid = localStorage.getItem('user_uuid');
      login.userCompany = localStorage.getItem('user_company');
      isValidToken = !(this.jwtHelper.isTokenExpired(login.token));
    }
    if (isValidToken) {
      const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', `Bearer ${login.token}`);
      const urlGetAuthorities = '@@' + `${this.basePath}/${this.basePathAuth}/${login.uuid}`;
      this.http.get<any>(urlGetAuthorities, { headers })
        .subscribe((auth) => {
          auth.token = login.token;
          auth.userCompany = login.userCompany;
          this.loginInfoSubject.next(auth);
        },
        (error: Error) => {
          this.errorLoginInfoSubject.next(error);
        });
    } else {
      login = new Login();
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_uuid');
      localStorage.removeItem('user_company');
    }
  }

  getStatusApi(apiUrl) {
    let statusApi;
    this.http.get(apiUrl + '/', {responseType: 'text'})
      .subscribe( res => {
        statusApi = res;
        this.statusApiSubject.next(statusApi);
      },
      err => {
        statusApi = 'API Offline -> ' + err.message;
        this.statusApiSubject.next(statusApi);
      });
  }

  getCompanyUserInterface(company) {
    this.companyUiList = [
      {
        company: 'Trustion',
        theme: 'default-theme',
        url: '../../assets/trustion/trustion-logo.png'
      },
      {
        company: 'Praia Love S/A',
        theme: 'default-theme',
        url: '../../assets/trustion/trustion-logo.png'
      },
      {
        company: 'Somos Juntos LTDA',
        theme: 'digital-theme',
        url: '../../assets/digital/logo.webp'
      }
    ];
    const ui = this.companyUiList.find((uiItem) => uiItem.company === company);
    if (ui) {
      this.themeSubject.next(ui);
    } else {
      this.themeSubject.next(this.companyUiList[0]);
    }
  }
}
