import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// modulos
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';
import { UserxempresagetComponent } from '../userxempresaget/userxempresaget.component';

@Component({
  selector: 'app-userxempresa',
  templateUrl: './userxempresa.component.html',
  styleUrls: ['./userxempresa.component.css']
})
export class UserxempresaComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  public dsUsuarios: MatTableDataSource<any>;

  dispColumns: string[] = ['tipousuario','rut','nombre','direccion','telefono','ccosto','cru'];

  cargando = false;
  grabando = false;
  creando = false;
  filtro = '';
  registro;

  id = 0;
  id_empresa = 0;
  rut = ''
  nombre = ''
  direccion = ''
  comuna = ''
  telefono = ''
  email = ''
  tipousuario = ''
  ccosto = ''

  tiposEmpresa = [{tipo: 'A', descripcion: 'Administrador'},
                  {tipo: 'U', descripcion: 'Usuario'}];

  constructor( private dialogRef2: MatDialogRef<UserxempresaComponent>,
               @Inject(MAT_DIALOG_DATA) public data,
               public dialog2: MatDialog,
               private datos: DatosService,               
               public loginService: LoginService ) {
    this.registro = this.data.empresa;
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  close() {
    this.dialogRef2.close();
  }

  cargarUsuarios() {  // 
    this.cargando = true;
    this.id = 0;
    this.datos.getServicioWEB( '/usuariosxempresa', { id_empresa: this.registro.id } )
        .subscribe( (dev: any) => {
            //
            console.log(dev);
            this.cargando = false;
            if ( dev.resultado === 'error' || dev.resultado === 'nodata' ) {
              Swal.fire('No existen usuarios para desplegar');
            } else {
              this.dsUsuarios = new MatTableDataSource(dev.datos);
              this.dsUsuarios.paginator = this.paginator.toArray()[0];
              this.dsUsuarios.sort = this.sort.toArray()[0];
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
    this.dsUsuarios.filter = filterValue.trim().toLowerCase();
    if (this.dsUsuarios.paginator) {
      this.dsUsuarios.paginator.firstPage();
    }
    //    
  }

  crearUsuario() {
    this.abrirDialog( null );
  }
  verUsuario( row ) {
    this.abrirDialog( row );
  }  
  abrirDialog( row? ) {
    //
    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.disableClose = false;
    dialogConfig2.autoFocus = false;
    dialogConfig2.data = { empresa: this.registro, row };
    //
    const dialogRef2 = this.dialog2.open( UserxempresagetComponent, dialogConfig2 );
    //
    dialogRef2.afterClosed()
      .subscribe( data => {
        if ( data ) {
          this.grabarUsuarioEmpresa( data );
        }
      });  
    //  
  }

  grabarUsuarioEmpresa( deta ) {
      //
      this.grabando = true;
      //
      //
      this.datos.postServicioWEB( '/usuariosxempresa', deta )
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
              this.cargarUsuarios();
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
  
  eliminarUsuario( row ) {}

}
