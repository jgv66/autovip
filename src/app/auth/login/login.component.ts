import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

// declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email ] ],
    psw1:     ['', [Validators.required ] ]
  });
  cargando = false;
  yaEstoy = false;
  year = new Date().getFullYear();

  constructor( public router: Router,
               private fb: FormBuilder,
               private loginService: LoginService ) { }

  ngOnInit() {
    // init_plugins();
  }

  doLogin() {
    this.cargando = true;
    this.loginService.login( this.loginForm.get('email').value, this.loginForm.get('psw1').value )
      .subscribe( (data:any) => {
          // console.log(data);
          this.cargando = false;
          try {
            if ( data.resultado === 'ok' ) {
              this.loginService.put( data.datos[0] );  /* esta accion gatilla el relleno de datos */
              this.router.navigate(['/']);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email/Password no coinciden',
                footer: '<a href>Corrija y reintente</a>'
              });            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email/Password no coinciden',
              footer: '<a href>Corrija y reintente</a>'
            });
          }
      },
        (err) => {
          this.cargando = false;
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Email/Password no coinciden',
              footer: '<a href>Corrija y reintente</a>'
          });
          console.log( 'Err', err );
      });
  }

}

