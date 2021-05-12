//
var pdfs = require('html-pdf');
var path = require('path');
//
module.exports = {
    //
    saveDefinitionIMG: function(sql, ib64, extension, id_pqt) {
        //
        var query = `
      insert into k_paquetes_img ( id_paquete, fechains, img_exten, img_name )
      values ( ${ id_pqt }, getdate(), '${ extension }', '${ ib64 }' ) ;`;
        console.log('saveIMG', query);
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                return { resultado: 'ok', datos: resultado };
            })
            .catch(err => {
                console.log('saveIMG error ', err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    getImages: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        if exists ( select * from k_paquetes_img with (nolock) where id_paquete = ${ body.id_pqt } ) begin
            select 'ok' as resultado, img_name as imgb64
                    ,convert(nvarchar(10), fechains, 103) as fecha
                    ,convert(nvarchar(5), fechains, 108) as hora
            from k_paquetes_img with (nolock)
            where id_paquete = ${ body.id_pqt };
        end
        else begin
            select 'nodata' as resultado
        end;
      `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(resultado => {
                return resultado.recordset;
            })
            .then(resultado => {
                if (resultado) {
                    return { resultado: 'ok', datos: resultado };
                } else {
                    return { resultado: 'error', datos: resultado };
                }
            })
            .catch(err => {
                console.log(err);
                return { resultado: 'error', datos: err };
            });
    },
    //
    comunas: function(sql, body) {
        //
        const query = 'select comuna from k_auto_comunas order by comuna ;';
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    getEmpresas: function(sql, body) {
        //
        const query = `
          select id,empresa,fantasia
          from k_auto_empresas
          where desvinculada=0
          order by empresa ;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    licencias: function(sql, body) {
        //
        const query = `
            select  licencia
                    ,'('+licencia+') '+descripcion as descrip
            from k_auto_licencias with (nolock)
            order by licencia ;
          `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    vehiculosChicos: function(sql, body) {
        //
        const query = `
        SELECT id,marca+', '+modelo+' Pat.:'+patente as vehiculo
        FROM k_autovip.dbo.k_auto_vehiculos
        where desvinculado = 0
        order by vehiculo;
      `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    vehiculosTotal: function(sql, body) {
        //
        const query = `
          SELECT ve.*
                ,ts.tipodeservicio
                ,em.empresa,em.fantasia
                ,convert(varchar(10),fechavencsoap,120) as soap
                ,convert(varchar(10),fechavenccirculacion,120) as circulacion
                ,convert(varchar(10),fechavenctaximetro,120) as taximetro
                ,convert(varchar(10),fechavencrevtecnica,120) as revisiontecnica
          FROM k_auto_vehiculos as ve with (nolock)
          left join k_auto_tiposervicio as ts with (nolock) on ts.id=ve.idtiposervicio
          left join k_auto_empresas as em with (nolock) on em.id=ve.idasignacionempresa
          where desvinculado = 0 ;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    tipoServicio: function(sql, body) {
        //
        const query = `
          SELECT id,tipodeservicio
          FROM k_auto_tiposervicio
          order by tipodeservicio ;
          `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    getConductoresChico: function(sql) {
        //
        const query = `
          SELECT id,nombres,licencia,fechavenclicencia
          FROM k_auto_conductores with (nolock)
          where desvinculado=0
          order by desvinculado desc, nombres ;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    getConductores: function(sql) {
        //
        const query = `
          SELECT cond.*
                ,ve.marca+', '+ve.modelo as vehiculo, ve.patente
                ,ts.tipodeservicio
                ,convert(varchar(10),cond.fechanac,120) as nacimiento
                ,convert(varchar(10),cond.fechavenclicencia,120) as vencimiento
          FROM k_auto_conductores as cond with (nolock)
          left join k_auto_vehiculos as ve with (nolock) on ve.id=cond.idvehiculo
          left join k_auto_tiposervicio as ts with (nolock) on ts.id=cond.idtiposervicio
          where cond.desvinculado=0;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    validaUsuario: function(sql, body) {
        //
        const query = `
          select cast(1 as bit) as resultado,'TCarGo!' as nombreemp,u.*
          from k_auto_system_users as u
          where lower(u.email)=lower('${body.email}')
            and u.clave='${ body.clave }'
            and u.desvinculado = 0;
          `;
        //
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    todos: function(sql, body) {
        //
        const query = 'SELECT id,nombre FROM k_auto_system_users where desvinculado = 0 order by nombre ;';
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    grabarUsuario: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
            begin try
            if exists(select *
                      from k_usuarios as u with(nolock)
                      where u.id = ${ body.id }) begin
                --
                update k_usuarios
                set desvinculado=0
                    ,nombre = '${ body.nombre}'
                    ,email = '${ body.email}'
                    ,clave = '${ body.code }'
                where id = ${ body.xid };
                --
            end
            else begin
                --
                insert into k_usuarios(nombre, email, clave, desvinculado, cargo)
                values( '${ body.nombre}', '${ body.email}', '${ body.code }', 0, '' );
                --
            end;
            --
            select cast(1 as bit) as resultado;
            --
            end try
            begin catch
                select cast(0 as bit) as resultado;
            end catch;
            `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    addConductor: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists(select * from k_auto_conductores with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_conductores
                set  rut = '${ body.rut }'
                    ,nombres = '${ body.nombres}'
                    ,direccion = '${ body.direccion}'
                    ,comuna = '${ body.comuna}'
                    ,email = '${ body.email}'
                    ,telefonos = '${ body.fono}'
                    ,clave = '${ body.clave}'
                    ,nacionalidad = '${ body.nacionalidad}'
                    ,fechanac = '${ body.fechanac}'
                    ,licencia = '${ body.licencia }'
                    ,fechavenclicencia = '${ body.fechavenclicencia }'
                    ,idtiposervicio = ${ body.idtiposervicio }
                    ,estado = '${ body.estado }'
                    ,desvinculado=0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_conductores (rut,nombres,direccion,comuna,email,telefonos,clave,nacionalidad,fechanac,licencia,fechavenclicencia,idtiposervicio,estado,desvinculado)
                values ('${ body.rut }','${ body.nombres}','${ body.direccion}','${ body.comuna}','${ body.email}','${ body.fono}','${ body.clave}','${ body.nacionalidad}'
                        ,'${ body.fechanac}','${ body.licencia }','${ body.fechavenclicencia }',${ body.idtiposervicio },'${ body.estado }',0);
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Insertado exitosamente!' as mensaje;
                --
            end;
            end try
            begin catch
                --
                set @Error = @@ERROR
                set @ErrMsg = ERROR_MESSAGE();
                --
                if (@@TRANCOUNT > 0) rollback transaction;
                --
                select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
                --
            end catch;
            `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    delConductor: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
          declare @Error nvarchar(250),
                  @ErrMsg nvarchar(2048);
          begin try
            if exists(select * from k_auto_conductores with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_conductores desvinculado=1 where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Eliminado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                select cast(0 as bit) as resultado, cast(1 as bit) as error, 'Registro no existe' as mensaje;
                --
            end;
          end try
          begin catch
            --
            set @Error = @@ERROR
            set @ErrMsg = ERROR_MESSAGE();
            --
            if (@@TRANCOUNT > 0) rollback transaction;
            --
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
          end catch;
          `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    addVehiculo: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
          declare @Error nvarchar(250),
                  @ErrMsg nvarchar(2048);
          begin try
          if exists(select * from k_auto_vehiculos with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_vehiculos
              set marca='${body.marca}',
                  modelo='${body.modelo}',
                  anno='${body.anno}',
                  patente='${body.patente}',
                  fechavencsoap='${body.fechavencsoap}',
                  fechavenccirculacion='${body.fechavenccirculacion}',
                  fechavenctaximetro='${body.fechavenctaximetro}',
                  fechavencrevtecnica='${body.fechavencrevtecnica}',
                  estadokitemergencia='${body.estadokitemergencia}',
                  estadokitneumatico='${body.estadokitneumatico}',
                  imeiwifiabordo='${body.imeiwifiabordo}',
                  imeitelefonoabordo='${body.imeitelefonoabordo}',
                  idtagabordo='${body.idtagabordo}',
                  idtransbankabordo='${body.idtransbankabordo}',
                  idtiposervicio=${body.idtiposervicio},
                  idasignacionempresa=${body.idasignacionempresa},
                  desvinculado=0
              where id = ${ body.id };
              --
              set @Error = @@ERROR
              if (@Error < > 0) begin
                  set @ErrMsg = ERROR_MESSAGE();
                  THROW @Error, @ErrMsg, 0;
              end
              --
              select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
              --
          end
          else begin
              --
              insert into k_auto_vehiculos (marca,modelo,anno,patente,fechavencsoap,fechavenccirculacion,fechavenctaximetro,fechavencrevtecnica,estadokitemergencia,
                                            estadokitneumatico,imeiwifiabordo,imeitelefonoabordo,idtagabordo,idtransbankabordo,idtiposervicio,idasignacionempresa,desvinculado)
              values ('${body.marca}','${body.modelo}','${body.anno}','${body.patente}','${body.fechavencsoap}','${body.fechavenccirculacion}','${body.fechavenctaximetro}','${body.fechavencrevtecnica}',
                      '${body.estadokitemergencia}','${body.estadokitneumatico}','${body.imeiwifiabordo}','${body.imeitelefonoabordo}','${body.idtagabordo}','${body.idtransbankabordo}',
                      ${body.idtiposervicio},${body.idasignacionempresa},0 );
              --
              set @Error = @@ERROR
              if (@Error < > 0) begin
                  set @ErrMsg = ERROR_MESSAGE();
                  THROW @Error, @ErrMsg, 0;
              end
              --
              select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Insertado exitosamente!' as mensaje;
              --
          end;
          end try
          begin catch
              --
              set @ErrMsg = ERROR_MESSAGE();
              if (@@TRANCOUNT > 0) rollback transaction;
              select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
              --
          end catch;
          `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    delVehiculo: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
          declare @Error nvarchar(250),
                  @ErrMsg nvarchar(2048);
          begin try
            if exists(select * from k_auto_vehiculos with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_vehiculos set desvinculado=1 where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Eliminado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                select cast(0 as bit) as resultado, cast(1 as bit) as error, 'Registro no existe' as mensaje;
                --
            end;
          end try
          begin catch
            --
            set @Error = @@ERROR
            set @ErrMsg = ERROR_MESSAGE();
            --
            if (@@TRANCOUNT > 0) rollback transaction;
            --
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
          end catch;
        `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    usuariosPorEmpresa: function(sql, body) {
        //
        const query = `
          SELECT id,nombre
          FROM k_auto_empresas_usuarios with (nolock)
          where desvinculado = 0
          order by nombre ;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    empresasTotal: function(sql) {
        //
        const query = `
          select emp.*,usr.nombre as nombreadmin
          from k_auto_empresas as emp with (nolock)
          left join k_auto_empresas_usuarios as usr with (nolock) on usr.id=emp.idadministra
          where emp.desvinculada=0
          order by empresa ;
        `;
        //
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    addEmpresa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
        if exists(select * from k_auto_empresas with (nolock) where id = ${ body.id }) begin
            --
            update k_auto_empresas
            set empresa='${body.empresa}',
                fantasia='${body.fantasia}',
                rut='${body.rut}',
                departamento='${body.departamento}',
                idadministra=${body.idadministra},
                trato='${body.trato}',
                desvinculada=0
            where id = ${ body.id };
            --
            set @Error = @@ERROR
            if (@Error < > 0) begin
                set @ErrMsg = ERROR_MESSAGE();
                THROW @Error, @ErrMsg, 0;
            end
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
            --
        end
        else begin
            --

            insert into k_auto_empresas (empresa,fantasia,rut,departamento,idadministra,trato,desvinculada)
                                 values ('${body.empresa}','${body.fantasia}','${body.rut}','${body.departamento}',${body.idadministra},'${body.trato}',0 );
            --
            set @Error = @@ERROR
            if (@Error < > 0) begin
                set @ErrMsg = ERROR_MESSAGE();
                THROW @Error, @ErrMsg, 0;
            end
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Insertado exitosamente!' as mensaje;
            --
        end;
        end try
        begin catch
            --
            set @ErrMsg = ERROR_MESSAGE();
            if (@@TRANCOUNT > 0) rollback transaction;
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
        end catch;
        `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    delEmpresa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
          declare @Error nvarchar(250),
                  @ErrMsg nvarchar(2048);
          begin try
            if exists(select * from k_auto_empresas with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_empresas set desvinculada=1 where id = ${ body.id };
                --
                set @Error = @@ERROR
                if (@Error < > 0) begin
                    set @ErrMsg = ERROR_MESSAGE();
                    THROW @Error, @ErrMsg, 0;
                end
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Eliminada exitosamente!' as mensaje;
                --
            end
            else begin
                --
                select cast(0 as bit) as resultado, cast(1 as bit) as error, 'Registro no existe' as mensaje;
                --
            end;
          end try
          begin catch
            --
            set @ErrMsg = ERROR_MESSAGE();
            if (@@TRANCOUNT > 0) rollback transaction;
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
          end catch;
          `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    vehiculos2Conductores: function(sql) {
        //
        const query = `
          select asig.id
                ,convert(varchar(10),asig.fechaini,120) as fechaini
                ,convert(varchar(10),asig.fechafin,120) as fechafin
                ,asig.idconductor
                ,asig.idvehiculo
                ,veh.patente,veh.marca,veh.modelo,veh.anno
                ,cond.nombres, cond.licencia
                ,convert(varchar(10),cond.fechavenclicencia,120) as fechavenclicencia
          from k_auto_asignacion as asig with (nolock)
          left join k_auto_conductores as cond with (nolock) on cond.id = asig.idconductor
          left join k_auto_vehiculos as veh with (nolock) on veh.id = asig.idvehiculo
          order by asig.fechaini desc ;
        `;
        //
        console.log(query);
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    addVehiculo2Conductor: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try;
          if exists(select * from k_auto_asignacion with (nolock) where id = ${ body.id }) begin
            --
            begin transaction;
              --
              update k_auto_asignacion
              set fechaini='${body.fechaini}',
                  fechafin='${body.fechafin}',
                  idconductor=${body.idconductor},
                  idvehiculo=${body.idvehiculo},
                  fechaserver=getdate()
              where id = ${ body.id };
              --
              update k_auto_conductores
              set idvehiculo = ${ body.idvehiculo }
              where id = ${ body.idconductor };
              --
            commit transaction;
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
            --
          end
          else begin
            --
            begin transaction;
              --
              insert into k_auto_asignacion (fechaini,fechafin,idconductor,idvehiculo,fechaserver)
              values ('${body.fechaini}','${body.fechafin}',${body.idconductor},${body.idvehiculo},getdate() );
              --
              update k_auto_conductores
              set idvehiculo = ${ body.idvehiculo }
              where id = ${ body.idconductor };
              --
            commit transaction;
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Insertado exitosamente!' as mensaje;
            --
          end;
        end try
        begin catch
            --
            set @Error = @@ERROR
            set @ErrMsg = ERROR_MESSAGE();
            --
            if (@@TRANCOUNT > 0) rollback transaction;
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
        end catch;
        `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    Tarifas: function(sql) {
        //
        const query = `
        select t.*
        from k_auto_tarifas as t with (nolock)
        where t.eliminada = 0
        order by t.descripcion ;
        `;
        //
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    addTarifa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
        if exists (select * from k_auto_tarifas with (nolock) where id = ${ body.id }) begin
            --
            update k_auto_tarifas
            set descripcion='${body.descripcion}',
                valor=${body.valor},
                eliminada=0
            where id = ${ body.id };
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
            --
        end
        else begin
            --
            insert into k_auto_tarifas (descripcion,valor,eliminada)
                                values ('${body.descripcion}',${body.valor},0 );
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Insertado exitosamente!' as mensaje;
            --
        end;
        end try
        begin catch
            --
            set @Error = @@ERROR
            set @ErrMsg = ERROR_MESSAGE();
            --
            if (@@TRANCOUNT > 0) rollback transaction;
            --
            select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
            --
        end catch;
        `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
    delTarifa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_tarifas with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_tarifas set eliminada=1 where id = ${ body.id };
              --
              select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Eliminada exitosamente!' as mensaje;
              --
          end
          else begin
              --
              select cast(0 as bit) as resultado, cast(1 as bit) as error, 'Registro no existe' as mensaje;
              --
          end;
        end try
        begin catch
          --
          set @Error = @@ERROR
          set @ErrMsg = ERROR_MESSAGE();
          --
          if (@@TRANCOUNT > 0) rollback transaction;
          --
          select cast(0 as bit) as resultado, cast(1 as bit) as error, @ErrMsg as mensaje;
          --
        end catch;
        `;
        console.log(query);
        // --------------------------------------------------------------------------------------------------
        var request = new sql.Request();
        //
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
    },
    //
};