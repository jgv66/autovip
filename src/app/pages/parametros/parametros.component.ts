import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// modulos
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsTarifas: MatTableDataSource<any>;
  public dsServicios: MatTableDataSource<any>;
  public dsTurnos: MatTableDataSource<any>;
  public dsEstados: MatTableDataSource<any>;
  public dsLicencias: MatTableDataSource<any>;

  dispTaColumns: string[] = ['descripcion','valor','cru'];
  dispSeColumns: string[] = ['tipodeservicio','descripcion','cru'];
  dispTuColumns: string[] = ['conductor','marca','modelo','anno','patente','jornada','inicial','final','cru'];
  dispEsColumns: string[] = ['orden','codigo','descripcion','cru'];  
  dispLiColumns: string[] = ['licencia','descrip','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  filtro = '';

  // variables de conductor
  id = 0
  descripcion = '';
  valor = 0;
  //
  tipodeservicio = ''
  //
  id_conductor = 0;
  id_vehiculo = 0;
  jornada = '';
  inicio1 = '';
  termino1 = '';
  inicio2 = '';
  termino2 = '';
  //
  orden = '';
  codigo = '';
  //
  licencia = '';

  constructor( public loginService: LoginService,
               private datos: DatosService,
               public dialog: MatDialog,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.loginService.comunas();
    this.loginService.vehiculos();
    this.loginService.conductoresChico();
    //
    this.cargaTodo();
    //
  }

  cargaTodo() {
    this.cargarTarifas();
    this.cargarServicios();    
    this.cargarTurnos();
    this.cargarEstados();    
    this.cargarLicencias();
  }

  cargarTarifas() {
    this.cargando = true;
    this.datos.getServicioWEB( '/tarifas' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen tarifas para desplegar');
            } else {
              this.dsTarifas = new MatTableDataSource(dev.datos);
              // this.dsTarifas.paginator = this.paginator.toArray()[0];
              // this.dsTarifas.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarServicios() {
    this.cargando = true;
    this.datos.getServicioWEB( '/tipodeservicio' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen servicios para desplegar');
            } else {
              this.dsServicios = new MatTableDataSource(dev.datos);
              // this.dsServicios.paginator = this.paginator.toArray()[0];
              // this.dsServicios.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarTurnos() {
    this.cargando = true;
    this.datos.getServicioWEB( '/turnos' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen servicios para desplegar');
            } else {
              this.dsTurnos = new MatTableDataSource(dev.datos);
              // this.dsTurnos.paginator = this.paginator.toArray()[0];
              // this.dsTurnos.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarEstados() {
    this.cargando = true;
    this.datos.getServicioWEB( '/estados' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen servicios para desplegar');
            } else {
              this.dsEstados = new MatTableDataSource(dev.datos);
              // this.dsEstados.paginator = this.paginator.toArray()[0];
              // this.dsEstados.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarLicencias()  {
    this.cargando = true;
    this.datos.getServicioWEB( '/licencias' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen licencias para desplegar');
            } else {
              this.dsLicencias = new MatTableDataSource(dev.datos);
              // this.dsLicencias.paginator = this.paginator.toArray()[0];
              // this.dsLicencias.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }

  aplicarFiltro( event, par ) {
    //
    const filterValue = (event.target as HTMLInputElement).value;
    //
    if ( par === 'tarifa') {
      this.dsTarifas.filter = filterValue.trim().toLowerCase();
      if (this.dsTarifas.paginator) {
        this.dsTarifas.paginator.firstPage();
      }
    } else if ( par === 'servicio') {
      this.dsServicios.filter = filterValue.trim().toLowerCase();
      if (this.dsServicios.paginator) {
        this.dsServicios.paginator.firstPage();
      }
    } else if ( par === 'turno') {
      this.dsTurnos.filter = filterValue.trim().toLowerCase();
      if (this.dsTurnos.paginator) {
        this.dsTurnos.paginator.firstPage();
      }
    } else if ( par === 'estado') {
      this.dsEstados.filter = filterValue.trim().toLowerCase();
      if (this.dsEstados.paginator) {
        this.dsEstados.paginator.firstPage();
      }
    } 
    //
  }

  verTarifa( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.descripcion = row.descripcion;
    this.valor = row.valor;
    //
  }
  verServicio( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.tipodeservicio = row.tipodeservicio;
    this.descripcion = row.descripcion;
    //
  }
  verTurnos( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.id_conductor = row.id_conductor;
    this.id_vehiculo = row.id_vehiculo;
    this.jornada = row.jornada;
    this.inicio1 = row.inicio1;
    this.termino1 = row.termino1;
    this.inicio2 = row.inicio2;
    this.termino2 = row.termino2;
    //
  }  
  verEstados( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.orden = row.orden;
    this.codigo = row.codigo;
    this.descripcion = row.descripcion;
    //
  }
  verLicencias( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.licencia = row.licencia;
    this.descripcion = row.descripcion;
    //
  }

  grabarTarifa( regCliForm: NgForm ) {
    if ( regCliForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return;
    }
    //
    const deta = {
      id: this.id,
      descripcion: regCliForm.value.descripcion,
      valor: regCliForm.value.valor,
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/tarifas', deta )
      .subscribe( (dev: any) => {
          console.log(dev);
          this.grabando = false;
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regCliForm.reset();
            this.cargarTarifas();
            this.creando = false;
            this.id = 0;
          } else  {
            Swal.fire( dev.datos );
          }
      },
      (error) => {
        this.grabando = false;
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }
  grabarServicio( regCliForm: NgForm ) {
    if ( regCliForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return;
    }
    //
    const deta = {
      id: this.id,
      tipodeservicio: regCliForm.value.tipodeservicio,
      descripcion: regCliForm.value.descripcion,
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/tipodeservicio', deta )
      .subscribe( (dev: any) => {
          console.log(dev);
          this.grabando = false;
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regCliForm.reset();
            this.cargarServicios();
            this.creando = false;
            this.id = 0;
          } else  {
            Swal.fire( dev.datos );
          }
      },
      (error) => {
        this.grabando = false;
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }  
  grabarEstado( regCliForm: NgForm ) {
    if ( regCliForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return;
    }
    //
    const deta = {
      id: this.id,
      orden: regCliForm.value.orden,
      codigo: regCliForm.value.codigo,
      descripcion: regCliForm.value.descripcion,
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/estados', deta )
      .subscribe( (dev: any) => {
          console.log(dev);
          this.grabando = false;
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regCliForm.reset();
            this.cargarTurnos();
            this.creando = false;
            this.id = 0;
          } else  {
            Swal.fire( dev.datos );
          }
      },
      (error) => {
        this.grabando = false;
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }
  grabarTurno( regCliForm: NgForm ) {
    if ( regCliForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return;
    }
    //
    const deta = {
      id: this.id,
      idconductor: regCliForm.value.id_conductor,
      idvehiculo: regCliForm.value.id_vehiculo,
      jornada: regCliForm.value.jornada,
      inicio1: regCliForm.value.inicio1,
      termino1: regCliForm.value.termino1,
      inicio2: regCliForm.value.inicio2,
      termino2: regCliForm.value.termino2,
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/turnos', deta )
      .subscribe( (dev: any) => {
          console.log(dev);
          this.grabando = false;
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regCliForm.reset();
            this.cargarTurnos();
            this.creando = false;
            this.id = 0;
          } else  {
            Swal.fire( dev.datos );
          }
      },
      (error) => {
        this.grabando = false;
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }  
  grabarLicencia( regCliForm: NgForm ) {
    if ( regCliForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      return;
    }
    //
    const deta = {
      id: this.id,
      licencia: regCliForm.value.licencia,
      descripcion:  regCliForm.value.descrip
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/licencias', deta )
      .subscribe( (dev: any) => {
          console.log(dev);
          this.grabando = false;
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regCliForm.reset();
            this.cargarTurnos();
            this.creando = false;
            this.id = 0;
          } else  {
            Swal.fire( dev.datos );
          }
      },
      (error) => {
        this.grabando = false;
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }

  eliminarRegistro( row, caso ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: "No podrá revertir esta decisión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then( async (result) => {
      if (result.isConfirmed) {
        //
        const url = `/borra${ caso }`;
        //
        this.borraRegistro( row.id, url )
          .then( () => {
            if      ( caso === 'tarifa'   ) { this.cargarTarifas()   ; }
            else if ( caso === 'servicio' ) { this.cargarServicios() ; }
            else if ( caso === 'estado'   ) { this.cargarEstados()   ; }
            else if ( caso === 'turno'    ) { this.cargarTurnos()    ; }
            else if ( caso === 'licencia' ) { this.cargarLicencias() ; }
          });
          //
      }
    })
  }

  borraRegistro( id, url ) {
    return new Promise( (resolve, reject) => {
      this.datos.postServicioWEB( url, { id } )
        .subscribe( (dev: any) => {
            if ( dev.resultado === 'ok' ) {
              this.id = 0;
              Swal.fire( 'Borrado!', 'El registro de Servicio ha sido borrado del sistema.', 'success' );
              resolve(true);
            } else  {
              Swal.fire( dev.datos );
              reject(false);
            }
        },
        (error) => {
          Swal.fire('ERROR', error);
          reject(false);
        });
    })
  }

}
