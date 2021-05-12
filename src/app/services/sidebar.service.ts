import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: ' Ordenes de Trabajo ',
      icono: 'mdi mdi-worker',
      submenu: [

        { titulo: 'Ingresar Orden Trabajo',  url: 'presuping'     },
        { titulo: 'Asignar Técnico a OT',    url: 'presupasigtec' },
        { titulo: 'Servicio Técnico',        url: 'presupsertec'  },
        { titulo: 'Cerrar Orden de Trabajo', url: 'presupcietec'  },
        { titulo: 'Consultar',               url: 'presupconsulta'},
        { titulo: 'Informes',                url: 'presupinforme' },
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
        { titulo: 'Vehículos a Conductores',  url: 'vehi2condu'   },
        { titulo: 'Empresas / Clientes',      url: 'empresas'     },  /** dentro de la empresa van los centros de costo */
        { titulo: 'Tarifas',                  url: 'tarifas'      },
        { titulo: 'Tipos de Servicio',        url: 'usuarios'     },
        { titulo: 'Usuarios',                 url: 'usuarios'     },
        { titulo: 'Estados',                  url: 'usuarios'     },
        { titulo: 'Turnos',                   url: 'usuarios'     },
      ]
    },
  ];

  constructor() { }
}
