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
import { UserxempresaComponent } from '../userxempresa/userxempresa.component';
@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsClientes: MatTableDataSource<any>;
  public dsProveedores: MatTableDataSource<any>;

  dispColumns: string[] = ['tipo','empresa','rut','direccion','telefonos','trato','horarios','cru'];
  dispPColumns: string[] = ['tipo','empresa','rut','direccion','telefonos','horarios','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  articulos = [];
  filas = 0;
  filtro = '';
  tratos = [{codigo:'Tarifa Plana'},{codigo:'Descuentos'},{codigo:'Promoción'}]
  tiposEmpresa = [{codigo:'E',descripcion: 'Empresa'},{codigo:'P', descripcion: 'Particular'}]

  // variables de conductor
  id = 0
  entidad = '';
  tipo = ''
  empresa = '';
  fantasia = '';
  rut = '';
  direccion = '';
  comuna = '';
  telefonos = '';
  email = '';
  departamento = '';
  trato = '';
  horarios = '';
  matrizdiaslaborales = [true,true,true,true,true,true,true];

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
    this.cargarEmpresas('C');
    this.cargarEmpresas('P');
  }

  cargarEmpresas( entidad ) {
    this.cargando = true;
    this.id = 0;
    this.datos.getServicioWEB( '/empresastotal', { entidad } )
      .subscribe( (dev: any) => {
          //
          this.cargando = false;
          console.log(dev);
          if ( entidad === 'C' ) {
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen clientes para desplegar');
            } else {
              this.dsClientes = new MatTableDataSource(dev.datos);
              this.dsClientes.paginator = this.paginator.toArray()[0];
              this.dsClientes.sort = this.sort.toArray()[0];
              //
            }
          } else if ( entidad === 'P' ) {
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen proveedores para desplegar');
            } else {
              this.dsProveedores = new MatTableDataSource(dev.datos);
              this.dsProveedores.paginator = this.paginator.toArray()[0];
              this.dsProveedores.sort = this.sort.toArray()[0];
              //
            }
          }
      },
      (error) => {
        Swal.fire(error);
      });
  }

  aplicarFiltro( event, tipo ) {
    //
    const filterValue = (event.target as HTMLInputElement).value;
    if ( tipo === 'C' ) {
      this.dsClientes.filter = filterValue.trim().toLowerCase();
      if (this.dsClientes.paginator) {
        this.dsClientes.paginator.firstPage();
      }
    } else if ( tipo === 'P' ) {
      this.dsProveedores.filter = filterValue.trim().toLowerCase();
      if (this.dsProveedores.paginator) {
        this.dsProveedores.paginator.firstPage();
      }
    }
    //
  }

  verCliente( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.entidad = row.entidad;
    this.tipo = row.tipo;
    this.empresa = row.empresa;
    this.fantasia = row.fantasia;
    this.rut = row.rut;
    this.departamento = row.departamento;
    this.trato = row.trato;
    this.direccion = row.direccion;
    this.comuna = row.comuna;
    this.telefonos = row.telefonos;
    this.email = row.email;
    this.horarios = row.horarios;
    this.matrizdiaslaborales = this.deCodeDiasLaborales( row.diaslaborales );
    //
  }
  verProveedor( row, editar ) {
    //
    this.creando = editar;
    //
    this.id = row.id;
    this.tipo = row.tipo;
    this.empresa = row.empresa;
    this.fantasia = row.fantasia;
    this.rut = row.rut;
    this.departamento = row.departamento;
    this.direccion = row.direccion;
    this.comuna = row.comuna;
    this.telefonos = row.telefonos;
    this.email = row.email;
    this.horarios = row.horarios;
    //
  }  
  deCodeDiasLaborales( diaslaborales ) {
    const dato = [];
    for (let index = 0; index < diaslaborales.length; index++) {
      const element = diaslaborales[index];
      dato[index] = ( diaslaborales !== undefined || diaslaborales !== '' ) ? ( element === 'x' ) : false;
    }
    return dato;
  }
  codeDiasLaborales() {
    let dato = '';
    this.matrizdiaslaborales.forEach(element => {
      dato += element === true ? 'x' : ' ';
    });
    return dato;
  }

  grabarEntidad( regForm: NgForm, entidad ) {
    if ( regForm.invalid ) {
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
      entidad,
      id: this.id,
      tipo: ( entidad === 'P' ) ? 'E' : regForm.value.tipo,
      empresa: regForm.value.empresa,
      fantasia: ( entidad === 'P' ) ? 'E' : regForm.value.fantasia,
      rut: regForm.value.rut,
      departamento: ( entidad === 'P' ) ? 'E' : regForm.value.departamento,
      trato: ( entidad === 'P' ) ? 'E' : regForm.value.trato,
      direccion: regForm.value.direccion,
      comuna: regForm.value.comuna,
      telefonos: regForm.value.telefonos,
      email: regForm.value.email,
      horarios: regForm.value.horarios,
      diaslaborales: ( entidad === 'P' ) ? '' : this.codeDiasLaborales(), 
    };
    //
    this.grabando = true;
    //
    this.datos.postServicioWEB( '/empresa', deta )
      .subscribe( (dev: any) => {
        this.grabando = false;
        const entidad = regForm.value.entidad;
        console.log(dev,entidad);
          if ( dev.resultado === 'ok' ) {
            Swal.fire({ position: 'top-end',
                        icon: 'success',
                        title: 'Datos grabados con éxito',
                        showConfirmButton: false,
                        timer: 1500
            });
            regForm.reset();
            this.cargarEmpresas( entidad );
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

  eliminarEntidad( row ) {
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
        this.borraRegistro( row.id, row.tipo );
      }
    })
  }

  borraRegistro( id, tipo ) {
    this.datos.postServicioWEB( '/borraempresa', { id } )
    .subscribe( (dev: any) => {
        if ( dev.resultado === 'ok' ) {
          Swal.fire(
            'Borrado!',
            'El registro ha sido borrado del sistema.',
            'success'
          );
          this.cargarEmpresas( tipo );
          this.id = 0;
        } else  {
          Swal.fire( dev.datos );
        }
    },
    (error) => {
      Swal.fire('ERROR', error);
    });
  }

  verUsuarios( row ) {
    //
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.data = { empresa: row };
    //
    const dialogRef = this.dialog.open( UserxempresaComponent, dialogConfig );
    //
    dialogRef.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    );  
    //
  }
  
}
