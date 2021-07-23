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
          select cast(1 as bit) as resultado,'CabCorp!' as nombreemp,u.*
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
    addConductor: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
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
                    ,estado = '${ body.estado }'
                    ,desvinculado=0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_conductores (rut,nombres,direccion,comuna,email,telefonos,clave,nacionalidad,fechanac,licencia,fechavenclicencia,estado,desvinculado)
                values ('${ body.rut }','${ body.nombres}','${ body.direccion}','${ body.comuna}','${ body.email}','${ body.fono}','${ body.clave}','${ body.nacionalidad}'
                        ,'${ body.fechanac}','${ body.licencia }','${ body.fechavenclicencia }','${ body.estado }',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
        const pre_query = `
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
        const query = pre_query.replace(/'null'/g, "null");
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
          SELECT uxe.*
          FROM k_auto_empresas_usuarios as uxe with (nolock)
          where uxe.desvinculado = 0
            and uxe.id_empresa = ${ body.id_empresa }
          order by uxe.nombre ;
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
    addUsrPorEmpresa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists(select * from k_auto_empresas_usuarios with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_empresas_usuarios
                set id_empresa = '${ body.id_empresa }'
                    ,rut = '${ body.rut }'
                    ,nombre = '${ body.nombre}'
                    ,direccion = '${ body.direccion}'
                    ,comuna = '${ body.comuna}'
                    ,telefono = '${ body.telefono}'
                    ,email = '${ body.email}'
                    ,tipousuario = '${ body.tipousuario }'
                    ,ccosto = '${ body.ccosto }'
                    ,desvinculado=0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_empresas_usuarios (id_empresa,rut,nombre,direccion,comuna,telefono,email,tipousuario,ccosto,desvinculado)
                values ('${ body.id_empresa }','${ body.rut }','${ body.nombre}','${ body.direccion}','${ body.comuna}','${ body.telefono}','${ body.email}','${ body.tipousuario }','${ body.ccosto }',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delUsrPorEmpresa: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
                if exists(select * from k_auto_empresas_usuarios with (nolock) where id = ${ body.id }) begin
                    --
                    update k_auto_empresas_usuarios set desvinculado=1 where id = ${ body.id };
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
    empresasTotal: function(sql, body) {
        // entidad es P=proveedor o C=cliente
        const query = `
            select emp.*
                   ,coalesce((select count(*) from k_auto_empresas_usuarios as u with (nolock) where u.id_empresa=emp.id ),0) as usuarios
            from k_auto_empresas as emp with (nolock)
            where emp.desvinculada=0 
              and emp.entidad = '${ body.entidad }'
            order by emp.empresa ;
        `;
        //
        // console.log(query);
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
        const pre_query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
        if exists(select * from k_auto_empresas with (nolock) where id = ${ body.id }) begin
            --
            update k_auto_empresas
            set tipo = '${body.tipo}',
                entidad ='${body.entidad}',
                empresa ='${body.empresa}',
                fantasia ='${body.fantasia}',
                rut = '${body.rut}',
                direccion = '${body.direccion}',
                comuna = '${body.comuna}',
                telefonos = '${body.telefonos}',
                email = '${body.email}',
                departamento = '${body.departamento}',
                trato = '${body.trato}',
                horarios = '${body.horarios}',
                diaslaborales = '${body.diaslaborales}',
                desvinculada=0
            where id = ${ body.id };
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
            --
        end
        else begin
            --
            insert into k_auto_empresas (tipo,entidad,empresa,fantasia,rut,direccion,
                                         comuna,telefonos,email,departamento,trato,horarios,
                                         diaslaborales,desvinculada)
                                 values ('${body.tipo}','${body.entidad}','${body.empresa}','${body.fantasia}','${body.rut}','${body.direccion}',
                                         '${body.comuna}','${body.telefonos}','${body.email}','${body.departamento}','${body.trato}','${body.horarios}',
                                         '${body.diaslaborales}',0 );
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
        const query = pre_query.replace(/'null'/g, "null");
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
        const pre_query = `
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
        const query = pre_query.replace(/'null'/g, "null");
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
        const pre_query = `
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
        const query = pre_query.replace(/'null'/g, "null");
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
    tipoDeServicio: function(sql) {
        //
        const query = `
      select t.*
      from k_auto_tiposervicio as t with (nolock)
      where t.eliminado = 0
      order by t.tipodeservicio ;
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
    addTipoDeServicio: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
        if exists (select * from k_auto_tiposervicio with (nolock) where id = ${ body.id }) begin
            --
            update k_auto_tiposervicio
            set descripcion='${body.descripcion}',
                tipodeservicio='${body.tipodeservicio}',
                eliminado=0
            where id = ${ body.id };
            --
            select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
            --
        end
        else begin
            --
            insert into k_auto_tiposervicio (descripcion,tipodeservicio,eliminado)
                                     values ('${body.descripcion}','${body.tipodeservicio}',0 );
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delTipoDeServicio: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_tiposervicio with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_tiposervicio set eliminado=1 where id = ${ body.id };
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
    traeUsuarios: function(sql) {
        //
        const query = `
            select t.*,cast(t.admin as int) as adminis
            from k_auto_system_users as t with (nolock)
            where t.desvinculado = 0
            order by t.nombres ;
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
    addUsuario: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists (select * from k_auto_system_users with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_system_users
                set nombres = '${ body.nombres}',
                    email = '${ body.email}',
                    rut = '${ body.rut}',
                    telefono = '${ body.telefono}',
                    clave = '${ body.clave}',
                    [admin] = '${ body.admin}',
                    desvinculado = 0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_system_users (email,clave,rut,nombres,telefono,[admin],desvinculado)
                values ('${ body.email}','${ body.clave}','${ body.rut}','${ body.nombres}','${ body.telefono}','${ body.admin}',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delUsuario: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_system_users with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_system_users set desvinculado=1 where id = ${ body.id };
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
    traeEstados: function(sql) {
        //
        const query = `
            select e.*
            from k_auto_estados as e with (nolock)
            where e.eliminado = 0
            order by e.orden ;
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
    addEstado: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists (select * from k_auto_estados with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_estados
                set orden = '${ body.orden}',
                    codigo = '${ body.codigo}',
                    descripcion = '${ body.descripcion}',
                    eliminado = 0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_estados (orden,codigo,descripcion,eliminado)
                values ('${ body.orden}','${ body.codigo}','${ body.descripcion}',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delEstado: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_estados with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_estados set eliminado=1 where id = ${ body.id };
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
    traeTurnos: function(sql) {
        //
        const query = `
            select	t.*
                    ,cond.nombres as conductor
                    ,veh.marca, veh.modelo, veh.anno, patente
            from k_auto_turnos as t with (nolock)
            left join k_auto_conductores as cond with (nolock) on cond.id=t.idconductor
            left join k_auto_vehiculos as veh with (nolock) on veh.id=t.idvehiculo
            where t.eliminado = 0
            order by cond.nombres ;
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
    addTurno: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists (select * from k_auto_turnos with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_turnos
                set idconductor = ${ body.idconductor},
                    idvehiculo = ${ body.idvehiculo},
                    jornada = '${ body.jornada}',
                    inicio1 = '${ body.inicio1}',
                    termino1 = '${ body.termino1}',
                    inicio2 = '${ body.inicio2}',
                    termino2 = '${ body.termino2}',
                    eliminado = 0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_turnos (idconductor,idvehiculo,jornada,inicio1,termino1,inicio2,termino2,eliminado)
                values (${ body.idconductor},${ body.idvehiculo},'${ body.jornada}','${ body.inicio1}','${ body.termino1}','${ body.inicio2}','${ body.termino2}',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delTurno: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_turnos with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_turnos set eliminado=1 where id = ${ body.id };
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
    vehiculosKilometraje: function(sql) {
        //
        const query = `
            select	ve.id as idvehiculo,ve.marca,ve.modelo,ve.anno,ve.patente
                    ,km.id as idconductor, cond.nombres
                    ,coalesce(km.kmactual,0) as kmactual
                    ,coalesce( convert(varchar(10),km.fecharegistro,120),'') as fecharegistro                    
                    ,coalesce( convert(varchar(10),km.proxmantencion,120),'') as proxmantencion
                    ,coalesce( datediff( dd, getdate(), km.proxmantencion ), 0 ) as diasproxmantencion
            FROM k_auto_vehiculos as ve with (nolock)
            left join k_auto_registrokm as km with (nolock) on km.idvehiculo=ve.id and coalesce(km.eliminado,0)=0
            left join k_auto_asignacion as asig with (nolock) on asig.idvehiculo=ve.id and cast( getdate() as date ) between asig.fechaini and asig.fechafin
            left join k_auto_conductores as cond with (nolock) on cond.id=km.idconductor
            where ve.desvinculado = 0 
            order by diasproxmantencion;
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
    addKilometraje: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
                begin transaction;
                    --
                    if exists (select * from k_auto_registrokm with (nolock) where idvehiculo = ${ body.idvehiculo }) begin
                        --
                        update k_auto_registrokm
                        set idconductor = ${ body.idconductor},
                            kmactual = '${ body.kmactual}',
                            proxmantencion = '${ body.proxmantencion}',
                            fecharegistro = getdate(),
                            eliminado = 0
                        where idvehiculo = ${ body.idvehiculo };
                        --
                    end
                    else begin
                        --
                        insert into k_auto_registrokm (idconductor,idvehiculo,kmactual,proxmantencion,fecharegistro,eliminado)
                        values (${ body.idconductor},${ body.idvehiculo},${ body.kmactual},'${ body.proxmantencion}',getdate(),0);
                        --
                    end;
                    --
                    insert into k_auto_registrokm_hist (idconductor,idvehiculo,kmactual,proxmantencion,fecharegistro)
                    values (${ body.idconductor},${ body.idvehiculo},${ body.kmactual},'${ body.proxmantencion}',getdate());
                    --
                commit transaction;
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delRegistroKm: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
            if exists (select * from k_auto_registrokm with (nolock) where idvehiculo = ${ body.idvehiculo }) begin
                begin transaction;
                    --
                    insert into k_auto_registrokm_hist (idconductor,idvehiculo,kmactual,proxmantencion,fecharegistro,eliminado,fecharegistro)
                    select km.idconductor,km.idvehiculo,km.kmactual,km.proxmantencion,km.fecharegistro,1,getdate()
                    from k_auto_registrokm as km
                    where km.idvehiculo = ${ body.idvehiculo } ;
                    --
                    update k_auto_registrokm set eliminado=1 where idvehiculo = ${ body.idvehiculo };
                    --
                commit transaction;
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
    vehiculosDetenidos: function(sql, body) {
        //
        const query = `
            SELECT	ve.id as idvehiculo,ve.marca,ve.modelo,ve.anno,ve.patente
                    ,cond.id as idconductor, cond.nombres as conductor
                    ,coalesce(det.kmactual,0) as kmactual
                    ,det.motivo,det.responsableliberarcion as responsable
                    ,coalesce( convert(varchar(10),det.fechadetencion,120),'') as fechadetencion
                    ,coalesce( convert(varchar(10),det.fechaalta,120),'') as fechaalta
                    ,coalesce( convert(varchar(10),det.fecharegistro,120),'') as fecharegistro
                    ,det.reparado
                    ,(case when det.reparado=1 then 'REPARADO - '+coalesce( convert(varchar(10),det.fechareparacion,103),'') else 'En reparación' end) as textoestado
                    ,det.fechareparacion
            FROM k_auto_vehiculos as ve with (nolock)
            inner join k_auto_detenidos	  as det  with (nolock) on det.idvehiculo=ve.id 
            left  join k_auto_conductores as cond with (nolock) on cond.id=det.idconductor
            where ve.desvinculado = 0 ` +
            (body === undefined ? ' and coalesce(det.reparado,0)=0 ' : '');
        //
        console.log(query);
        const request = new sql.Request();
        return request.query(query)
            .then(function(results) {
                return results.recordset;
            });
        //
    },
    //
    addDetenidos: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const fecharep = (body.fechareparacion === undefined)
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
                begin transaction;
                    --
                    if exists (select * from k_auto_detenidos with (nolock) where idvehiculo = ${ body.idvehiculo }) begin
                        --
                        update k_auto_detenidos
                        set idconductor = ${ body.idconductor},
                            idvehiculo = ${ body.idvehiculo},
                            kmactual = ${ body.kmactual},
                            fechadetencion = cast( '${body.fechadetencion}' as date),
                            fechaalta = cast('${body.fechaalta}' as date),
                            motivo = '${body.motivo}',
                            responsableliberarcion = '${body.responsable}',
                            reparado = ${ body.reparado ? 1 : 0 },
                            fechareparacion = case when '${body.fechareparacion}'='undefined' then null else '${body.fechareparacion}' end,
                            fecharegistro = getdate(),
                            eliminado = 0
                        where idvehiculo = ${ body.idvehiculo };
                        --
                    end
                    else begin
                        --
                        insert into k_auto_detenidos (idconductor,idvehiculo,kmactual,fechadetencion,fechaalta
                                                      ,fechareparacion,motivo,responsableliberarcion,reparado,fecharegistro,eliminado)
                        values (${ body.idconductor},${ body.idvehiculo},${ body.kmactual},cast( '${body.fechadetencion}' as date),cast('${body.fechaalta}' as date)
                               ,case when '${body.fechareparacion}'='undefined' then null else '${body.fechareparacion}' end,'${ body.motivo}','${ body.responsable}',${ body.reparado ? 1 : 0 },getdate(),0);
                        --
                    end;
                    --
                    insert into k_auto_detenidos_hist ( idconductor,idvehiculo,kmactual,fechadetencion,fechaalta
                                                        ,fechareparacion,motivo,responsableliberarcion,reparado,fecharegistro,eliminado)
                    values (${ body.idconductor},${ body.idvehiculo},${ body.kmactual},cast( '${body.fechadetencion}' as date),cast('${body.fechaalta}' as date)
                           ,case when '${body.fechareparacion}'='undefined' then null else '${body.fechareparacion}' end,'${ body.motivo}','${ body.responsable}',${ body.reparado ? 1 : 0 },getdate(),0);
                    --
                commit transaction;
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delRegistroStop: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
            if exists (select * from k_auto_detenidos with (nolock) where idvehiculo = ${ body.idvehiculo }) begin
                --
                insert into k_auto_detenidos_hist ( idconductor,idvehiculo,kmactual,fechadetencion,fechaalta
                                                    ,fechareparacion,motivo,responsableliberarcion,reparado,fecharegistro,eliminado)
                select  stop.idconductor,stop.idvehiculo,stop.kmactual,stop.fechadetencion,stop.fechaalta
                        ,stop.fechareparacion,stop.motivo,stop.responsableliberarcion,stop.reparado,getdate(),1
                from k_auto_detenidos as stop
                where km.idvehiculo = ${ body.idvehiculo } ;
                --
                update k_auto_detenidos set eliminado=1 where idvehiculo = ${ body.idvehiculo };
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
    licencias: function(sql, body) {
        //
        const query = `
            select id,licencia,'('+licencia+') '+descripcion as descrip, descripcion
            from k_auto_licencias with (nolock)
            where eliminada = 0
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
    addLicencias: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const pre_query = `
            declare @Error nvarchar(250),
                    @ErrMsg nvarchar(2048);
            begin try
            if exists (select * from k_auto_licencias with (nolock) where id = ${ body.id }) begin
                --
                update k_auto_licencias
                set licencia = '${ body.licencia}',
                    descripcion = '${ body.descripcion}'
                    eliminado = 0
                where id = ${ body.id };
                --
                select cast(1 as bit) as resultado, cast(0 as bit) as error, 'Grabado exitosamente!' as mensaje;
                --
            end
            else begin
                --
                insert into k_auto_licencias (licencia,descripcion,eliminado)
                values ('${ body.licencia}','${ body.descripcion}',0);
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
        const query = pre_query.replace(/'null'/g, "null");
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
    delLicencia: function(sql, body) {
        // --------------------------------------------------------------------------------------------------
        const query = `
        declare @Error nvarchar(250),
                @ErrMsg nvarchar(2048);
        begin try
          if exists (select * from k_auto_licencias with (nolock) where id = ${ body.id }) begin
              --
              update k_auto_licencias set eliminada=1 where id = ${ body.id };
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