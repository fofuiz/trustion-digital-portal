import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { GlobalService } from './global.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
      public globalService: GlobalService,
      public router: Router
  ) {}

  canActivate(): boolean {
    if (this.globalService.isAccessTokenInvalid()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}