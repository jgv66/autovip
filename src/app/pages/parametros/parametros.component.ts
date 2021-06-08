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

  dispTaColumns: string[] = ['descripcion','valor','cru'];
  dispSeColumns: string[] = ['tipodeservicio','descripcion','cru'];
  dispTuColumns: string[] = ['tipo','empresa','rut','direccion','telefonos','horarios','cru'];
  dispEsColumns: string[] = ['tipo','empresa','rut','direccion','telefonos','horarios','cru'];

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


  constructor( public loginService: LoginService,
               private datos: DatosService,
               public dialog: MatDialog,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.cargarTarifas();
    this.cargarServicios();
    //
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
              this.dsTarifas.paginator = this.paginator.toArray()[0];
              this.dsTarifas.sort = this.sort.toArray()[0];
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
              this.dsServicios.paginator = this.paginator.toArray()[0];
              this.dsServicios.sort = this.sort.toArray()[0];
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
        Swal.fire({
          title: 'Error!',
          text: error,
          icon: 'error',
          confirmButtonText: 'Salir'
        })
      });
  }

  eliminarTarifa( row ) {
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
        this.borraRegistroTa( row.id );
      }
    })
  }
  borraRegistroTa( id ) {
    this.datos.postServicioWEB( '/borraservicio', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro de Servicio ha sido borrado del sistema.',
            'success'
          );
          this.cargarTarifas();
          this.id = 0;
        } else  {
          Swal.fire( dev.datos );
        }
    },
    (error) => {
      Swal.fire('ERROR', error);
    });
  }

  eliminarServicio( row ) {
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
        this.borraRegistroSe( row.id );
      }
    })
  }
  borraRegistroSe( id ) {
    this.datos.postServicioWEB( '/borraservicio', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro de Servicio ha sido borrado del sistema.',
            'success'
          );
          this.cargarServicios();
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
