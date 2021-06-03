import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// modulos
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsCodigos: MatTableDataSource<any>;
  public dsKilomet: MatTableDataSource<any>;
  public dsDetenci: MatTableDataSource<any>;
  
  dispColumns:  string[] = ['marca','modelo','anno','patente','empresa','tipodeservicio','soap','circulacion','taximetro','serviciotecnico','cru'];
  dispKColumns: string[] = ['marca','modelo','anno','patente','conductor','kmactual','fecharegistro','proxmantencion','diasproxmantencion','cru'];
  dispSColumns: string[] = ['marca','modelo','anno','patente','conductor','kmactual','motivo','responsable','fechadetencion','fechalta','reparado','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  filas = 0;
  filtro = '';

  estados = [{estado: 'Bueno'},{estado: 'Regular'},{estado: 'Malo'}];
  // variables de conductor
  id = 0
  marca = '';
  modelo = '';
  anno = '';
  patente = '';
  fechavencsoap: Date;
  fechavenccirculacion: Date;
  fechavenctaximetro: Date;
  fechavencrevtecnica: Date;
  estadokitemergencia = '';
  estadokitneumatico = '';
  imeiwifiabordo = '';
  imeitelefonoabordo = '';
  idtagabordo = '';
  idtransbankabordo = '';
  idtiposervicio = 0;
  idasignacionempresa = 0;
  // km
  idvehiculo = 0;
  idconductor = 0;
  kmactual = 0;
  proxmantencion: Date;
  //
  fechadetencion: Date;
  motivo = '';
  responsableliberarcion = '';
  fechaalta: Date;
  estaReparado = false;
  fechareparacion: Date;
  //
  constructor( public loginService: LoginService,
               private datos: DatosService,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.loginService.tipoServicio();
    this.loginService.empresas();
    //
    this.loginService.vehiculos();
    this.loginService.conductoresChico();
    //
    this.refreshAll()
    //
  }

  refreshAll() {
    this.cargarVehiculos();
    this.cargarKilometraje();
    this.cargarDetencion()
  }

  cargarVehiculos() {
    this.cargando = true;
    this.datos.getServicioWEB( '/vehiculostotal' )
        .subscribe( (dev: any) => {
            //
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen vehículos para desplegar');
            } else {
              this.filas = dev.datos.length;
              this.dsCodigos = new MatTableDataSource(dev.datos);
              this.dsCodigos.paginator = this.paginator.toArray()[0];
              this.dsCodigos.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarKilometraje() {
    this.cargando = true;
    this.datos.getServicioWEB( '/vehiculoskilometraje' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen vehículos para desplegar Kilometraje');
            } else {
              this.filas = dev.datos.length;
              this.dsKilomet = new MatTableDataSource(dev.datos);
              this.dsKilomet.paginator = this.paginator.toArray()[0];
              this.dsKilomet.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }
  cargarDetencion() {
    this.cargando = true;
    this.datos.getServicioWEB( '/vehiculosdetenidos' )
        .subscribe( (dev: any) => {
            //
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen vehículos para desplegar detenciones');
            } else {
              this.filas = dev.datos.length;
              this.dsDetenci = new MatTableDataSource(dev.datos);
              this.dsDetenci.paginator = this.paginator.toArray()[0];
              this.dsDetenci.sort = this.sort.toArray()[0];
              //
            }
        },
        (error) => {
          Swal.fire(error);
        });
  }

  aplicarFiltro( event, tab ) {
    //
    const filterValue = (event.target as HTMLInputElement).value;
    //
    if ( tab === 'definicion' ) {
      this.dsCodigos.filter = filterValue.trim().toLowerCase();
      if (this.dsCodigos.paginator) {
        this.dsCodigos.paginator.firstPage();
      } 
    } else if ( tab === 'kilometros' ) {
      this.dsKilomet.filter = filterValue.trim().toLowerCase();
      if (this.dsKilomet.paginator) {
        this.dsKilomet.paginator.firstPage();
      }    
    } else if ( tab === 'detencion' ) {
      this.dsDetenci.filter = filterValue.trim().toLowerCase();
      if (this.dsDetenci.paginator) {
        this.dsDetenci.paginator.firstPage();
      }    
    }
  }

  verVehiculo( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id
    this.marca = row.marca;
    this.modelo = row.modelo;
    this.anno = row.anno;
    this.patente = row.patente;
    this.fechavencsoap = row.soap;
    this.fechavenccirculacion = row.circulacion;
    this.fechavenctaximetro = row.taximetro;
    this.fechavencrevtecnica = row.revisiontecnica;
    this.estadokitemergencia = row.estadokitemergencia;
    this.estadokitneumatico = row.estadokitneumatico;
    this.imeiwifiabordo = row.imeiwifiabordo;
    this.imeitelefonoabordo = row.imeitelefonoabordo;
    this.idtagabordo = row.idtagabordo;
    this.idtransbankabordo = row.idtransbankabordo;
    this.idtiposervicio = row.idtiposervicio;
    this.idasignacionempresa = row.idasignacionempresa;
    //
  }
  verKilometro( row, editar ) {
    //
    this.creando = editar;
    //
    this.idvehiculo = row.idvehiculo;
    this.idconductor = row.idconductor;
    this.kmactual = row.kmactual;
    this.proxmantencion = row.proxmantencion;
    //
  }  
  verDetencion( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    //
    this.idvehiculo = row.idvehiculo;
    this.idconductor = row.idconductor;
    this.kmactual = row.kmactual;
    this.fechadetencion = row.fechadetencion;
    this.motivo = row.motivo;
    this.responsableliberarcion = row.responsableliberarcion;
    this.fechaalta = row.fechaalta;
    this.estaReparado = row.reparado;
    this.fechareparacion = row.fechareparacion;
    //
  }

  grabarVehiculo( regCliForm ) {
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
    this.grabando = true;
    //
    const deta = {
      id: this.id,
      marca: regCliForm.value.marca,
      modelo: regCliForm.value.modelo,
      anno: regCliForm.value.anno,
      patente: regCliForm.value.patente,
      fechavencsoap: regCliForm.value.fechavencsoap,
      fechavenccirculacion: regCliForm.value.fechavenccirculacion,
      fechavenctaximetro: regCliForm.value.fechavenctaximetro,
      fechavencrevtecnica: regCliForm.value.fechavencrevtecnica,
      estadokitemergencia: regCliForm.value.estadokitemergencia,
      estadokitneumatico: regCliForm.value.estadokitneumatico,
      imeiwifiabordo: regCliForm.value.imeiwifiabordo,
      imeitelefonoabordo: regCliForm.value.imeitelefonoabordo,
      idtagabordo: regCliForm.value.idtagabordo,
      idtransbankabordo: regCliForm.value.idtransbankabordo,
      idtiposervicio: regCliForm.value.idtiposervicio,
      idasignacionempresa: regCliForm.value.idasignacionempresa,
    };
    //
    this.datos.postServicioWEB( '/vehiculo', deta )
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
            this.cargarVehiculos();
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
  grabarKilometraje( regKmForm ){
    //      
    if ( regKmForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
    //
    this.grabando = true;
    //
    const deta = {
      idvehiculo: this.idvehiculo,
      idconductor: regKmForm.value.idconductor,
      kmactual: regKmForm.value.kmactual,
      proxmantencion: regKmForm.value.proxmantencion,
    };
    //
    this.datos.postServicioWEB( '/vehiculoskilometraje', deta )
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
            regKmForm.reset();
            this.cargarKilometraje();
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
  grabarDetencion( regStopForm ){
    //      
    if ( regStopForm.invalid ) {
      Swal.fire({
        title: 'Error!',
        text: 'Debe definir los datos obligatorios para continuar con una grabación',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }
    //
    this.grabando = true;
    //
    const deta = {
      id: this.id,
      idvehiculo: regStopForm.value.idvehiculo,
      idconductor: regStopForm.value.idconductor,
      kmactual: regStopForm.value.kmactual,
      fechadetencion: regStopForm.value.fechadetencion,
      motivo: regStopForm.value.motivo,
      responsableliberarcion: regStopForm.value.responsableliberarcion,
      fechaalta: regStopForm.value.fechaalta,
      reparado: ( this.estaReparado ? 1 : 0 ),
      fechareparacion: regStopForm.value.fechareparacion,
    };
    //
    this.datos.postServicioWEB( '/vehiculoskilometraje', deta )
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
            regStopForm.reset();
            this.cargarDetencion();
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

  eliminarVehiculo( row ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: "No podrá revertir esta decisión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.borraRegistro( row.id );
      }
    })
  }
  borraRegistro( id ) {
    this.datos.postServicioWEB( '/borravehiculo', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del vehiculo ha sido borrado del sistema.',
            'success'
          );
          this.cargarVehiculos();
          this.id = 0;
        } else  {
          Swal.fire( dev.datos );
        }
    },
    (error) => {
      Swal.fire('ERROR', error);
    });
  }

  eliminarKilometro( row ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: "No podrá revertir esta decisión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.borraRegistroKm( row.idvehiculo );
      }
    })
  }
  borraRegistroKm( idvehiculo ) {
    this.datos.postServicioWEB( '/borraregistrokm', { idvehiculo } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del kilometraje ha sido borrado del sistema.',
            'success'
          );
          this.cargarKilometraje();
          this.idvehiculo = 0;
        } else  {
          Swal.fire( dev.datos );
        }
    },
    (error) => {
      Swal.fire('ERROR', error);
    });
  }

  eliminarDetencion( row ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: "No podrá revertir esta decisión",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.borraRegistroDet( row.id );
      }
    })
  }
  borraRegistroDet( id ) {
    this.datos.postServicioWEB( '/borraregistrostop', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del detención ha sido borrado del sistema.',
            'success'
          );
          this.cargarDetencion();
          this.id = 0;
        } else  {
          Swal.fire( dev.datos );
        }
    },
    (error) => {
      Swal.fire('ERROR', error);
    });
  }

}
