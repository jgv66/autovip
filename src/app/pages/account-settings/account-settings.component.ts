import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {

  constructor( private settingsService: SettingsService,
               private router: Router,
               public loginService: LoginService ) {}

  ngOnInit(): void {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/']);
    }
    this.settingsService.checkCurrentTheme();
  }

  changeTheme( theme: string ) {
        
    this.settingsService.changeTheme( theme );
    
  }

  

}
