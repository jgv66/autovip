import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
// sweet alert
import Swal from 'sweetalert2';
// material
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// modulos
import { LoginService } from '../../services/login.service';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-userxempresaget',
  templateUrl: './userxempresaget.component.html',
  styleUrls: ['./userxempresaget.component.css']
})
export class UserxempresagetComponent implements OnInit {

  creando = false;
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

  empresa;
  row;

  tipoUsuario = [{tipo: 'A', descripcion: 'Administrador'},
                 {tipo: 'U', descripcion: 'Usuario'}];

  constructor( private dialogRef: MatDialogRef<UserxempresagetComponent>,
               @Inject(MAT_DIALOG_DATA) public data,
               public loginService: LoginService ) { 
    this.empresa = this.data.empresa;
    this.row     = this.data.row;
  }
     
  ngOnInit() {
    //
    if ( this.row ) {
      this.id = this.row.id;    
      this.rut = this.row.rut;
      this.nombre = this.row.nombre
      this.direccion = this.row.direccion;
      this.comuna = this.row.comuna;
      this.telefono = this.row.telefono;
      this.email = this.row.email;
      this.tipousuario = this.row.tipousuario;
      this.ccosto = this.row.ccosto;
    }
    //
  }

  close() {
    this.dialogRef.close();
  }

  grabarDatos( regForm: NgForm ) {
    const deta = {
      id: this.id ,
      id_empresa: this.empresa.id,
      rut: regForm.value.rut,
      nombre: regForm.value.nombre,
      direccion: regForm.value.direccion,
      comuna: regForm.value.comuna,
      telefono: regForm.value.telefono,
      email: regForm.value.email,
      tipousuario: regForm.value.tipousuario,
      ccosto: regForm.value.ccosto,
    };
    //
    this.dialogRef.close( deta );
    //
  }
  
}
