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
import { Vehi2conduComponent } from './vehi2condu/vehi2condu.component';
import { TarifasComponent } from './tarifas/tarifas.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    AccountSettingsComponent,
    PresupIngresosComponent,
    ConductoresComponent,
    VehiculosComponent,
    EmpresasComponent,
    Vehi2conduComponent,
    TarifasComponent,
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
    Vehi2conduComponent,
    TarifasComponent,
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
