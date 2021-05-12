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
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsCodigos: MatTableDataSource<any>;
  public selection = new SelectionModel(true, []);

  dispColumns: string[] = ['empresa','fantasia','rut','departamento','trato','nombreadmin','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  articulos = [];
  filas = 0;
  filtro = '';
  tratos = [{codigo:'Tarifa Plana'},{codigo:'Descuentos'},{codigo:'Promoción'}]

  // variables de conductor
  id = 0
  empresa = '';
  fantasia = '';
  rut = '';
  departamento = '';
  idadministra = '';
  trato = '';

  constructor( public loginService: LoginService,
               private datos: DatosService,
               private router: Router ) { }

  ngOnInit() {
    if ( !this.loginService.usuario ) {
      this.router.navigate(['/login']);
    }
    //
    this.cargarEmpresas();
    this.loginService.UsuariosxEmpresa()
  }

  cargarEmpresas() {
    this.cargando = true;
    this.id = 0;
    this.datos.getServicioWEB( '/empresastotal' )
        .subscribe( (dev: any) => {
            //
            console.log(dev);
            this.cargando = false;
            //
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen empresas para desplegar');
            } else {
              this.filas = dev.datos.length;
              // this.articulos = dev.datos.slice();
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

  verEmpresa( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.empresa = row.empresa;
    this.fantasia = row.fantasia;
    this.rut = row.rut;
    this.departamento = row.departamento;
    this.idadministra = row.idadministra;
    this.trato = row.trato;
    //
  }

  grabarVehiculo(  regCliForm: NgForm  ) {
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
      empresa: regCliForm.value.empresa,
      fantasia: regCliForm.value.fantasia,
      rut: regCliForm.value.rut,
      trato: regCliForm.value.trato,
      departamento: regCliForm.value.departamento,
      idadministra: regCliForm.value.idadministra === undefined ? 0 : regCliForm.value.idadministra,
    };
    //
    this.datos.postServicioWEB( '/empresa', deta )
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
            this.cargarEmpresas();
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

  eliminarEmpresa( row ) {
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
    this.datos.postServicioWEB( '/borraempresa', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro del vehiculo ha sido borrado del sistema.',
            'success'
          );
          this.cargarEmpresas();
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
