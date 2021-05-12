import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  menuMaestros: any[];

  constructor( private sidebarService: SidebarService,
               public loginService: LoginService ) {
    this.menuItems = sidebarService.menu;
    this.menuMaestros = sidebarService.maestros;
    // console.log(this.menuItems)
  }

  ngOnInit(): void {}

}
