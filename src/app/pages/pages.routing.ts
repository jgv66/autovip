import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { PresupIngresosComponent } from './presup-ingresos/presup-ingresos.component';

import { ConductoresComponent } from './conductores/conductores.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { TarifasComponent } from './tarifas/tarifas.component';
import { TiposdeservicioComponent } from './tiposdeservicio/tiposdeservicio.component';
import { TurnosComponent } from './turnos/turnos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EstadosComponent } from './estados/estados.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        children: [
          { path: '',                  component: DashboardComponent,          data: { titulo: '' } },
          { path: 'conductores',       component: ConductoresComponent,        data: { titulo: 'Conductores' }},
          { path: 'vehiculos',         component: VehiculosComponent,          data: { titulo: 'Vehículos' }},
          { path: 'empresas',          component: EmpresasComponent,           data: { titulo: 'Empresas' }},
          { path: 'tarifas',           component: TarifasComponent,            data: { titulo: 'Tarifas' }},
          { path: 'servicios',         component: TiposdeservicioComponent,    data: { titulo: 'Tipos de Servicio' }},
          { path: 'turnos',            component: TurnosComponent,             data: { titulo: 'Turnos' }},
          { path: 'estados',           component: EstadosComponent,            data: { titulo: 'Estados' }},
          { path: 'usuarios',          component: UsuariosComponent,           data: { titulo: 'Usuarios' }},
          { path: 'account-settings',  component: AccountSettingsComponent,    data: { titulo: 'Ajustes de cuenta' }},
          { path: 'presuping',         component: PresupIngresosComponent,     data: { titulo: 'Ingreso de Ordenes de Servicio' }},
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


