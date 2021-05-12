import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-presup-ingresos',
  templateUrl: './presup-ingresos.component.html',
  styles: []
})
export class PresupIngresosComponent implements OnInit {

  public presupForm = this.fb.group({
    nombre:   ['', [Validators.required ] ],
    rut:      ['', [Validators.required ] ],
    direccion:['', [Validators.required ] ],
    comuna:   ['', [Validators.required ] ],
    telefonos:['', [Validators.required ] ],
    email:    ['', [Validators.required, Validators.email ] ],
    articulo: ['', [Validators.required ] ],
    modelo:   ['', [Validators.required ] ],
    serie:    ['', [Validators.required ] ],
    marca:    ['', [Validators.required ] ],
    fcompra:  ['', [Validators.required ] ],
    distrib:  ['', [Validators.required ] ],
    nrobolfac:['', [Validators.required ] ],
    nroguia:  ['' ],
    fingreso: ['', [Validators.required ] ],
    fdespacho:['' ],
    sta:      ['', [Validators.required ] ],
    defecto:  ['', [Validators.required ] ]
  });
  grabando = false;
  yaEstoy = false;
  public comunas = [];
  formSubmitted = false;

  constructor(public router: Router,
              private fb: FormBuilder,
              private datos: DatosService,
              public loginService: LoginService) { }
    
  ngOnInit() {
    this.comunas = this.loginService.comunasPermitidas;
  }

  campoNoValido( campo: string ): boolean {
    if ( this.presupForm.get(campo).invalid && this.formSubmitted  ) {
      return true;
    } else {
      return false;
    }
  };

  onSubmit() {
    //
    console.log(this.presupForm.value);
    this.formSubmitted = true;
    //
    if ( this.presupForm.valid ) {
      //
      this.grabando = true;
      //
      this.datos.postServicioWEB( '/newpresup', this.presupForm.value, this.loginService.usuario )
        .subscribe( (data: any) => {
            console.log(data);
            this.formSubmitted = false;
            if ( data.datos.resultado === true ) {
              //
              this.presupForm.reset();
              //
              Swal.fire({
                icon: 'success',
                title: 'Nro.Presupuesto: ' + data.datos.id,
                text: 'Los datos del nuevo presupuesto fueron grabados con éxito',
                footer: '<a href>Nro.Interno : ' + data.datos.id + ' </a>'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Cuidado...',
                text: 'El nuevo presupuesto no fue grabados',
                footer: '<a href>' + data.datos + '</a>'
              });
            }
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
  }


}
