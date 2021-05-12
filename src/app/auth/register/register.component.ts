import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {

  grabando = false;
  formSubmitted = false;
  registerForm = this.fb.group({
    nombre:   ['',    [Validators.required, Validators.minLength(3)  ] ],
    email:    ['',    [Validators.required, Validators.minLength(10), Validators.email ] ],
    psw1:     ['',    [Validators.required, Validators.minLength(3)  ] ],
    psw2:     ['',    [Validators.required, Validators.minLength(3)  ] ],
    terminos: [false, [Validators.required ] ],
  }, {
    validators: this.clavesIguales( 'psw1', 'psw2' )
  });
  
  constructor( private fb: FormBuilder,
               private loginService: LoginService ) {}

  crearUsuario() {
    //
    console.log( this.registerForm.value );
    this.formSubmitted = true;
    //
    if ( this.registerForm.valid ) {
      this.grabando = true;
      console.log('posteando formulario !!');
      this.loginService.crearUsuario( {
            id: 0,
            vigente: 1,
            nombre: this.registerForm.get('nombre').value, 
            email: this.registerForm.get('email').value, 
            code:  window.btoa( this.registerForm.get('psw1').value ) 
          } 
        )
        .subscribe( data => {
            console.log(data);
            this.grabando = false;
        },
        err => {
          console.log('error->',err);
        });
    } else {
      // console.log('Formulario no es correcto');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Corrija los errores en los datos solicitados y reintente.',
        footer: '<a href>Corrija y reintente</a>'
      });
    }
    //
  }

  campoNoValido( campo: string ): boolean {
    if ( this.registerForm.get(campo).invalid && this.formSubmitted  ) {
      return true;
    } else {
      return false;
    }
  };

  clavesDistintas() {
    //
    const p1 = this.registerForm.get('psw1').value;
    const p2 = this.registerForm.get('psw2').value;
    //
    if ( p1 !== p2 && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  clavesIguales( psw1Name: string, psw2Name: string ) {
    return ( formGroup: FormGroup ) => {
      // 
      const pObj1 = formGroup.get( psw1Name );
      const pObj2 = formGroup.get( psw2Name );
      //
      if ( pObj1.value === pObj2.value ) {
        pObj1.setErrors( null );
      } else {
        pObj1.setErrors( { noEsIgual: true } );
      }
      //
    }
  }

  terminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

}
