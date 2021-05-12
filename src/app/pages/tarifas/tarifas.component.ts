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
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsCodigos: MatTableDataSource<any>;
  public selection = new SelectionModel(true, []);

  dispColumns: string[] = ['descripcion','valor','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  articulos = [];
  filas = 0;
  filtro = '';

  // variables de conductor
  id = 0;
  descripcion = '';
  valor = 0;

  constructor(public loginService: LoginService,
              private datos: DatosService,
              private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.cargarTarifas();
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

  verTarifa( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.descripcion = row.descripcion;
    this.valor = row.valor;
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
    this.grabando = true;
    //
    const deta = {
      id: this.id,
      descripcion: regCliForm.value.descripcion,
      valor: regCliForm.value.valor,
    };
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
        this.borraRegistro( row.id );
      }
    })
  }

  borraRegistro( id ) {
    this.datos.postServicioWEB( '/borratarifa', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del conductor ha sido borrado del sistema.',
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
}
