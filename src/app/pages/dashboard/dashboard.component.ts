import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor( public loginService: LoginService,
               private router: Router ) { }

  ngOnInit(): void {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
  }

}
