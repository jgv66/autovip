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
  selector: 'app-vehi2condu',
  templateUrl: './vehi2condu.component.html',
  styleUrls: ['./vehi2condu.component.css']
})
export class Vehi2conduComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsCodigos: MatTableDataSource<any>;
  public selection = new SelectionModel(true, []);

  dispColumns: string[] = ['fechaini','fechafin','conductor','licencia','fechavenclicencia','marca','modelo','patente','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  asignaciones = [];
  filas = 0;
  filtro = '';

  // variables
  id = 0;
  fechaini: Date;
  fechafin: Date;
  idVehiculo = 0;
  idConductor = 0

  constructor( public loginService: LoginService,
               private datos: DatosService,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.loginService.vehiculos();
    this.loginService.conductoresChico();
    //
    this.cargarAsignaciones();
  }

  cargarAsignaciones() {
    this.id = 0;
    this.cargando = true;
    this.datos.getServicioWEB( '/vehi2condu' )
        .subscribe( (dev: any) => {
            //
            // console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen asignaciones de vehículos v/s conductores');
            } else {
              this.filas = dev.datos.length;
              this.asignaciones = dev.datos.slice();
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

  verAsignacion( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id
    this.fechaini = row.fechaini;
    this.fechafin = row.fechafin;
    this.idVehiculo = row.idvehiculo;
    this.idConductor = row.idconductor;
    //
  }

  grabarAsignacion( regCliForm ) {
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
      idconductor: regCliForm.value.idConductor,
      idvehiculo: regCliForm.value.idVehiculo,
      fechaini: regCliForm.value.fechaini,
      fechafin: regCliForm.value.fechafin,
    };
    //
    this.datos.postServicioWEB( '/vehi2condu', deta )
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
            this.cargarAsignaciones();
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

  eliminarAsignacion( row ) {
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
    this.datos.postServicioWEB( '/borravehi2condu', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del vehiculo a conductor ha sido borrado del sistema.',
            'success'
          );
          this.cargarAsignaciones();
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
