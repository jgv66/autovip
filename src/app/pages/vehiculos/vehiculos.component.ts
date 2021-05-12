import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
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
  public selection = new SelectionModel(true, []);

  dispColumns: string[] = ['marca','modelo','anno','patente','empresa','tipodeservicio','soap','circulacion','taximetro','serviciotecnico','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  articulos = [];
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
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.cargando = true;
    this.datos.getServicioWEB( '/vehiculostotal' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen vehículos para desplegar');
            } else {
              this.filas = dev.datos.length;
              this.articulos = dev.datos.slice();
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

  aplicarFiltro( event ) {
    //
    const filterValue = (event.target as HTMLInputElement).value;
    this.dsCodigos.filter = filterValue.trim().toLowerCase();
    //
    if (this.dsCodigos.paginator) {
      this.dsCodigos.paginator.firstPage();
    }
    //
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

}
