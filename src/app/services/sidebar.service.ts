import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: ' Viejes y Servicios ',
      icono: 'mdi mdi-worker',
      submenu: [
        { titulo: 'Órdenes de Servicio',      url: 'presuping' },
        { titulo: 'Conductores en Ruta',      url: 'presuping' },
        { titulo: 'Operaciones de excepción', url: 'presuping' },
        { titulo: 'Consultas',                url: 'presuping' },
        { titulo: 'Reportes',                 url: 'presuping' },
      ]
    },
  ];
  maestros: any[] = [
    {
      titulo: ' Tablas y Maestros',
      icono: 'mdi mdi-folder-multiple',
      submenu: [
        { titulo: 'Conductores',              url: 'conductores'  },
        { titulo: 'Vehículos',                url: 'vehiculos'    },
        { titulo: 'Empresas',                 url: 'empresas'     },
        { titulo: 'Parámetros',               url: 'parametros'   },
        // { titulo: 'Tarifas',                  url: 'tarifas'      },
        // { titulo: 'Tipos de Servicio',        url: 'servicios'    },
        // { titulo: 'Estados',                  url: 'estados'      },
        // { titulo: 'Turnos',                   url: 'turnos'       },
        { titulo: 'Usuarios',                 url: 'usuarios'     },
      ]
    },
  ];

  constructor() { }
}
