import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: string;
  usuario = undefined;
  comunasPermitidas = [];
  empresasPermitidas = [];
  usuariosPorEmpresa = [];
  licenciasPermitidas = [];
  vehiculosPermitidos = [];
  conductoresPermitidos = [];
  tipoDeServicio = [];
  usuarios = [];
  estalogeado = false;

  constructor(private http: HttpClient,
              private router: Router) {
    this.url = environment.API_URL;
    this.usuario = undefined;
    this.estalogeado = false;
    console.log('>>>> loginservice <<<<');
  }

  // ngOnInit() {}

  login(email: string, code: string) {
    const pssw = window.btoa( code );
    const xUrl = this.url + '/usr' ;
    return this.http.post( xUrl, { email, clave: pssw } );
  }

  logout() {
    this.usuario = undefined;
    this.router.navigate(['/login']);
  }

  async estaLogeado() {
    this.estalogeado = await ( this.usuario === undefined ) ? false : true ;
    return this.estalogeado;
  }

  put( user ) {
    this.usuario = user;
  }

  comunas() {
    const xUrl = this.url + '/comunas' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.comunasPermitidas = ( data.datos.length > 0 ) ? data.datos : [];
            // console.log('comunas',this.comunasPermitidas);
            } catch (error) {
              this.comunasPermitidas = [];
            }
          },
          (err) => {
            console.log('comunas()', err);
          }
        );
  }

  tipoLicencias() {
    const xUrl = this.url + '/licencias' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.licenciasPermitidas = ( data.datos.length > 0 ) ? data.datos : [];
            // console.log('licencias',this.licenciasPermitidas);
            } catch (error) {
              this.licenciasPermitidas = [];
            }
          },
          (err) => {
            console.log('licencias()', err);
          }
        );
  }

  vehiculos() {
    const xUrl = this.url + '/vehiculosChicos' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.vehiculosPermitidos = ( data.datos.length > 0 ) ? data.datos : [];
            // console.log('licencias',this.licenciasPermitidas);
            } catch (error) {
              this.vehiculosPermitidos = [];
            }
          },
          (err) => {
            console.log('licencias()', err);
          }
        );
  }

  conductoresChico() {
    const xUrl = this.url + '/conductoreschico' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.conductoresPermitidos = ( data.datos.length > 0 ) ? data.datos : [];
            // console.log('licencias',this.licenciasPermitidas);
            } catch (error) {
              this.conductoresPermitidos = [];
            }
          },
          (err) => {
            console.log('conductoreschico()', err);
          }
        );
  }

  empresas() {
    const xUrl = this.url + '/empresas' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.empresasPermitidas = ( data.datos.length > 0 ) ? data.datos : [];
            // console.log('licencias',this.licenciasPermitidas);
            } catch (error) {
              this.empresasPermitidas = [];
            }
          },
          (err) => {
            console.log('licencias()', err);
          }
        );
  }

  tipoServicio() {
    const xUrl = this.url + '/tiposervicio' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          try {
            this.tipoDeServicio = ( data.datos.length > 0 ) ? data.datos : [];
            } catch (error) {
              this.tipoDeServicio = [];
            }
          },
          (err) => {
            console.log('licencias()', err);
          }
        );
  }

  cargaUsuarios() {
    const xUrl = this.url + '/usuarios' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          // console.log(data);
          try {
            this.usuarios = ( data.datos.length > 0 ) ? data.datos : [];
          } catch (error) {
            this.usuarios = [];
          }
        },
        (err) => {
          console.log('cargaUsuarios()', err);
        }
      );
  }

  crearUsuario( datos ) {
    const xUrl = this.url + '/crearUsuario' ;
    const body = datos;
    return this.http.post( xUrl, body );
  }

  UsuariosxEmpresa() {
    const xUrl = this.url + '/usuariosxempresa' ;
    this.http.get( xUrl )
        .subscribe( (data: any) => {
          // console.log(data);
          try {
            this.usuariosPorEmpresa = ( data.datos.length > 0 ) ? data.datos : [];
          } catch (error) {
            this.usuariosPorEmpresa = [];
          }
        },
        (err) => {
          console.log('UsuariosPorEmpresa()', err);
        }
      );
  }

}
