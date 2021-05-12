import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
// modulos
import { LoginService } from 'src/app/services/login.service';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-conductores',
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.css']
})
export class ConductoresComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsCodigos: MatTableDataSource<any>;
  public selection = new SelectionModel(true, []);

  dispColumns: string[] = ['nombres','email','direccion','telefonos','vehiculo','patente','tipodeservicio','estado','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  articulos = [];
  filas = 0;
  filtro = '';

  // variables de conductor
  id = 0;
  email = '';
  pssw1 = '';
  nombres = '';
  rut = '';
  fechanac: Date;
  nacionalidad = '';
  direccion = '';
  comuna = '';
  fono = '';
  licencia = '';
  fechavenclicencia: Date;
  idvehiculo = '';
  idtiposervicio = '';
  estadoConductor = [{estado:'Habilitado'},{estado:'Suspendido'},{estado:'Cancelado'}];
  estado = '';

  constructor(public loginService: LoginService,
              private datos: DatosService,
              private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.loginService.comunas();
    this.loginService.tipoLicencias();
    this.loginService.vehiculos();
    this.loginService.tipoServicio();
    //
    this.cargarConductores();
  }

  cargarConductores() {
    this.cargando = true;
    this.datos.getServicioWEB( '/conductores' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen conductores para desplegar');
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

  searchItem(event) {
    console.log(event);
  }

  verConductor( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.comuna = row.comuna;
    this.direccion = row.direccion;
    this.email = row.email;
    this.estado = row.estado;
    this.fechanac = row.nacimiento;
    this.fechavenclicencia = row.vencimiento;
    this.fono = row.telefonos;
    this.idtiposervicio = row.idtiposervicio;
    this.idvehiculo = row.idvehiculo;
    this.licencia = row.licencia;
    this.nacionalidad = row.nacionalidad;
    this.nombres = row.nombres;
    this.pssw1 = window.atob(row.clave);
    this.rut = row.rut;
    //
  }

  grabarConductor( regCliForm: NgForm ) {
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
      comuna: regCliForm.value.comuna,
      direccion: regCliForm.value.direccion,
      email: regCliForm.value.email,
      estado: regCliForm.value.estado,
      fechanac: regCliForm.value.fechanac,
      fechavenclicencia: regCliForm.value.fechavenclicencia,
      fono: regCliForm.value.fono,
      idtiposervicio: regCliForm.value.idtiposervicio,
      idvehiculo: regCliForm.value.idvehiculo,
      licencia: regCliForm.value.licencia,
      nacionalidad: regCliForm.value.nacionalidad,
      nombres: regCliForm.value.nombres,
      clave: window.btoa(regCliForm.value.pssw1),
      rut: regCliForm.value.rut
    };
    //
    this.datos.postServicioWEB( '/conductor', deta )
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
            this.cargarConductores();
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

  eliminarConductor( row ) {
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
    this.datos.postServicioWEB( '/borraconductor', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del conductor ha sido borrado del sistema.',
            'success'
          );
          this.cargarConductores();
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
