import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PresupIngresosComponent } from './presup-ingresos/presup-ingresos.component';
import { ConductoresComponent } from './conductores/conductores.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { TiposdeservicioComponent } from './tiposdeservicio/tiposdeservicio.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TurnosComponent } from './turnos/turnos.component';
import { EstadosComponent } from './estados/estados.component';
import { UserxempresaComponent } from './userxempresa/userxempresa.component';
import { UserxempresagetComponent } from './userxempresaget/userxempresaget.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    PresupIngresosComponent,
    ConductoresComponent,
    VehiculosComponent,
    EmpresasComponent,
    TarifasComponent,
    TiposdeservicioComponent,
    UsuariosComponent,
    TurnosComponent,
    EstadosComponent,
    EmpresasComponent,
    UserxempresaComponent,
    UserxempresagetComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    PresupIngresosComponent,
    ConductoresComponent,
    VehiculosComponent,
    EmpresasComponent,
    TarifasComponent,
    TiposdeservicioComponent,
    UsuariosComponent,
    TurnosComponent,
    EstadosComponent,
    UserxempresaComponent,
    UserxempresagetComponent,    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    MaterialModule
  ]
})
export class PagesModule { }
