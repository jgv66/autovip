import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

import { PresupIngresosComponent } from './presup-ingresos/presup-ingresos.component';

import { ConductoresComponent } from './conductores/conductores.component';
import { VehiculosComponent } from './vehiculos/vehiculos.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { Vehi2conduComponent } from './vehi2condu/vehi2condu.component';
import { TarifasComponent } from './tarifas/tarifas.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        children: [
          { path: '',                  component: DashboardComponent,          data: { titulo: '' } },
          { path: 'account-settings',  component: AccountSettingsComponent,    data: { titulo: 'Ajustes de cuenta' }},
          { path: 'conductores',       component: ConductoresComponent,        data: { titulo: 'Conductores / Proveedores' }},
          { path: 'vehiculos',         component: VehiculosComponent,          data: { titulo: 'Vehículos' }},
          { path: 'empresas',          component: EmpresasComponent,           data: { titulo: 'Empresas / Clientes' }},
          { path: 'empresas',          component: EmpresasComponent,           data: { titulo: 'Empresas / Clientes' }},
          { path: 'vehi2condu',        component: Vehi2conduComponent,         data: { titulo: 'Asignación de Vehículos a Conductores' }},
          { path: 'tarifas',           component: TarifasComponent,            data: { titulo: 'Tarifas' }},
          { path: 'presuping',         component: PresupIngresosComponent,     data: { titulo: 'Ingreso de Ordenes de Servicio' }},
        ]
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


