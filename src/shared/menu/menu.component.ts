import { Component,  OnInit,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MenuService } from '../../services/menu.service';
import { MenuNode } from '../../model/menuitems';
import { GlobalService } from '../../services/global.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit, OnDestroy {

  // public menuItems: Array<MenuNode>;
  private subscriptions = new Subscription();
  public treeControl: FlatTreeControl<MenuFlatNode>;
  public treeFlattener;
  public dataSource;
  public miniBarStateOpen = true;
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  tooltipPositionAfter = (new FormControl(this.positionOptions[0])).value;
  expandedNodes: Array<any>;

  constructor(
    private menuService: MenuService,
    private router: Router,
    public globalService: GlobalService
  ) {}

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;

  ngOnInit() {
    this.treeControl = new FlatTreeControl<MenuFlatNode>(node => node.level, node => node.expandable);
    this.treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    // Workaround para o bug do tree que não redimensiona corretamente e sobrepõe conteudo no sidenav content
    this.treeControl.expansionModel.changed.subscribe(() => {
      window.setTimeout(() => {
        const size = document.getElementById('sideElem').offsetWidth;
        document.getElementById('mainContent').style.marginLeft = size + 'px';
      }, 150);
    });

    this.initListeners();
  }

  private initListeners() {
    this.registerOnSideViewMenu();
    this.registerOnMiniBar();
    this.menuService.setMenu(this.globalService.loginInfo);
  }

  registerOnSideViewMenu() {
    this.menuService.sideViewMenu$.subscribe((menuItems) => {
      const TREE_DATA: MenuNode[] = menuItems;
      this.dataSource.data = TREE_DATA;
    });
  }

  registerOnMiniBar() {
    this.menuService.miniBarState$.subscribe((miniBarStateOpen) => {
      if (!miniBarStateOpen) {
        this.treeControl.collapseAll();
      }
      if (this.miniBarStateOpen) {
        window.setTimeout(() => {
          const size = document.getElementById('sideElem').offsetWidth;
          document.getElementById('mainContent').style.marginLeft = size + 'px';
        }, 100);
      }
      this.miniBarStateOpen = miniBarStateOpen;
    });
  }

  setNodeState(selectedNode, nodeList) {
    const parent = nodeList.find((node) => (!!node.children && (node.id === selectedNode.id)));
    const child = nodeList.find((node) => ( !node.children && (node.id === selectedNode.id)));
    if (!!parent) {
      const parentList = nodeList.filter((node) => (!!node.children));
      parentList.forEach(parentItem => { parentItem.isSelected = false; });
      parent.isSelected = true;
    }
    if (!!child) {
      child.isSelected = true;
    }
    nodeList.forEach(node => {
      if (node.children) {
        this.setNodeState(selectedNode, node.children);
      }
    });
  }

  cleanNodeStates(nodeList) {
    nodeList.forEach(childItem => { childItem.isSelected = false; });
    nodeList.forEach(node => {
      if (node.children) {
        this.cleanNodeStates(node.children);
      }
    });
  }

  changeMenuOptionState(selectedNode) {
    const menuItems = this.dataSource.data;
    this.cleanNodeStates(menuItems);
    this.saveExpandedNodes();
    this.setNodeState(selectedNode, menuItems);
    this.menuService.sideViewMenuSubject.next(menuItems);
    this.restoreExpandedNodes();
  }

  clickMenuParentOption(node) {
    this.menuService.miniBarStateSubject.next(true);
    this.changeMenuOptionState(node);
  }

  clickMenuChildOption(node) {
    this.changeMenuOptionState(node);
    if (node.link) {
      this.router.navigate(['/home', { outlets: { sideview: [ node.link ] }}]);
    }
  }

  saveExpandedNodes() {
    this.expandedNodes = new Array<any>();
    this.treeControl.dataNodes.forEach(node => {
        if (node.expandable && this.treeControl.isExpanded(node)) {
            this.expandedNodes.push(node);
        }
    });
  }

  restoreExpandedNodes() {
    this.expandedNodes.forEach(node => {
        this.treeControl.expand(this.treeControl.dataNodes.find(n => n.name === node.name));
    });
  }

  private transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      id: node.id,
      name: node.name,
      hasChildren: node.hasChildren,
      isSelected: node.isSelected,
      hasPermission: node.hasPermission,
      link: node.link,
      tooltip: node.tooltip,
      style: node.style,
      fontSet: node.fontSet,
      fontIcon: node.fontIcon,
      level
    };
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
