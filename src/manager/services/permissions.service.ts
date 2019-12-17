import { TOKEN_BASEPATH_MANAGER } from '../../shared/constants';
import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Permission } from '../../model/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(
    private http: HttpClient,
    @Inject(TOKEN_BASEPATH_MANAGER) private basePath: string
  ) {
    console.log('********* do constructor: basePath => ' + basePath);
  }


  getPermissions() {
    this.http.get(this.basePath + '/permissions')
      .subscribe( response => {
        console.log('OK');
      },
      err => {
        // Erro já tratado no interceptor
      });
  }

  savePermission(permissionName) {
    const payload = new Permission();
    payload.name = permissionName;
    this.http.post(this.basePath + '/permissions', payload)
      .subscribe( response => {
        console.log('OK');
      },
      err => {
        // Erro já tratado no interceptor
      });
    console.log('Salvando Permissão => ' + permissionName);
  }
}
