import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { MenuNode } from '../model/menuitems';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private sidenav: MatSidenav;

  public sideViewMenuSubject = new Subject<Array<MenuNode>>();
  sideViewMenu$: Observable<Array<MenuNode>> = this.sideViewMenuSubject.asObservable();

  public miniBarStateSubject = new Subject<boolean>();
  miniBarState$: Observable<boolean> = this.miniBarStateSubject.asObservable();

  constructor() { }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public openMenu() {
      return this.sidenav.open();
  }

  public closeMenu() {
      return this.sidenav.close();
  }

  public toggleMenu(): void {
    this.sidenav.toggle();
  }

  public setMenu(login) {
    let menuItems: Array<MenuNode>;
    // const roleList = login.roles;
    // const isAdmin = this.hasRole(roleList, 'ADMIN');
    // if (isAdmin) {
    //   const hasAdminRead = this.hasPermission(isAdmin, 'p1_teste_read');
    //   const hasAdminUpdate = this.hasPermission(isAdmin, 'p1_teste_update');
    //   const hasAdminCreate = this.hasPermission(isAdmin, 'p1_teste_create');

    menuItems = [
        {
          id: 1,
          parentId: 0,
          name: 'Cadastrar',
          isSelected: false,
          hasPermission: true,
          link: 'manager',
          fontSet: 'fas',
          fontIcon: 'fa-edit',
          tooltip: 'Cadastrar',
          hasChildren: true,
          children: [
            {
              id: 21,
              parentId: 1,
              name: 'Cadastro de Usuários',
              isSelected: false,
              hasPermission: true,
              link: 'users',
              style: 'option-users'
            },
            {
              id: 22,
              parentId: 1,
              name: 'Cadastro de Permissões',
              isSelected: false,
              hasPermission: true,
              link: 'permissions',
              style: 'option-permissions'
            },
            {
              id: 23,
              parentId: 1,
              name: 'Cadastro de Roles',
              isSelected: false,
              hasPermission: true,
              link: 'roles',
              style: 'option-roles'
            },
          ]
        }, {
          id: 3,
          parentId: 0,
          name: 'Conciliação',
          isSelected: false,
          hasPermission: true,
          link: '',
          fontSet: 'fas',
          fontIcon: 'fa-handshake',
          tooltip: 'Opções de conciliação',
          hasChildren: true,
          children: [
            {
              id: 4,
              parentId: 3,
              name: 'Visão Operadora',
              isSelected: false,
              hasPermission: true,
              link: 'produto',
              style: 'option-produto'
            },
            {
              id: 5,
              parentId: 3,
              name: 'Visão Lojas',
              isSelected: false,
              hasPermission: true,
              link: 'empresa',
              style: 'option-empresa'
            },
            {
              id: 6,
              parentId: 3,
              name: 'Relatórios',
              isSelected: false,
              hasPermission: true,
              fontSet: 'fas',
              fontIcon: 'fa-file-alt',
              tooltip: 'visualizar relatórios',
              link: '',
              hasChildren: true,
              children: [
                {
                  id: 7,
                  parentId: 6,
                  name: 'Numerário',
                  isSelected: false,
                  hasPermission: true,
                  fontSet: 'far',
                  fontIcon: 'fa-money-bill-alt',
                  tooltip: 'Opções com numerários',
                  link: '',
                  hasChildren: true,
                  children: [
                    {
                      id: 8,
                      parentId: 7,
                      name: 'Vendas (Analítico)',
                      isSelected: false,
                      hasPermission: true,
                      link: ''
                    },
                    {
                      id: 9,
                      parentId: 7,
                      name: 'Numerários (Analítico)',
                      isSelected: false,
                      hasPermission: true,
                      link: ''
                    }
                  ]
                }, {
                  id: 10,
                  parentId: 6,
                  name: 'Cartões',
                  isSelected: false,
                  hasPermission: true,
                  fontSet: 'fas',
                  fontIcon: 'fa-credit-card',
                  tooltip: 'Opções para cartões',
                  link: '',
                  hasChildren: true,
                  children: [
                    {
                      id: 11,
                      parentId: 10,
                      name: 'Descritivo',
                      isSelected: false,
                      hasPermission: true,
                      link: ''
                    }
                  ]
                }
              ]
            }
          ]
        },
      ];

    this.sideViewMenuSubject.next(menuItems);
  }

  hasPermission(tela, permission) {
    return (!!tela.permissions.find((perm) => perm.name === permission));
  }

  hasRole(roleList, name) {
    return roleList.find((role) => role.name === name);
  }
}
