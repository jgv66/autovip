//
const express = require('express');
//
const path = require('path');
const dotenv = require('dotenv').config({ path: path.join(__dirname, '.env') });
//
const sql = require('mssql');
//------------------------------------------------------------------
/** variables de ambiente */
/******************************************************************/
const dbconex = {
    user: process.env.auto_DBCONN_user,
    password: process.env.auto_DBCONN_password,
    server: process.env.auto_DBCONN_server,
    port: parseInt(process.env.auto_DBCONN_port),
    database: process.env.auto_DBCONN_database,
    options: { encrypt: false, enableArithAbort: true }
};
const conn = sql.connect(dbconex);
//
const app = express();
const port = process.env.auto_NODE_PORT || 3045;
const server = app.listen(port, () => {
    console.log("Escuchando http en el puerto: %s", port);
});
//
const servicios = require('./k_servicios.js');
//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//
publicpath = path.resolve(__dirname, 'public');
app.use('/static', express.static(publicpath));
CARPETA_PDF = publicpath + '/pdf/';
CARPETA_IMG = publicpath + '/img/';
console.log(CARPETA_PDF);
// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get('/ping', (req, res) => {
    res.json({ resultado: "PONG" });
});

app.post('/usr',
    function(req, res) {
        //
        console.log(req.body);
        servicios.validaUsuario(sql, req.body)
            .then(function(data) {
                console.log('/usr', data);
                try {
                    if (data[0].resultado === true) {
                        res.json({ resultado: "ok", datos: data });
                    } else {
                        res.json({ resultado: "nodata", datos: '' });
                    }
                } catch (error) {
                    res.json({ resultado: 'error', datos: 'Usuario/Clave no existe. Corrija o verifique, luego reintente.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/usuarios',
    function(req, res) {
        //
        console.log(req.body);
        servicios.todos(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Usuario no existe. Corrija o verifique, luego reintente.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/crearUsuario',
    function(req, res) {
        //
        console.log(req.body);
        servicios.grabarUsuario(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: error });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/comunas',
    function(req, res) {
        //
        // console.log(req.body);
        servicios.comunas(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen comunas' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/empresas',
    function(req, res) {
        //
        // console.log(req.body);
        servicios.getEmpresas(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen empresas' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/licencias',
    function(req, res) {
        //
        // console.log(req.body);
        servicios.licencias(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen licencias' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/vehiculoschicos',
    function(req, res) {
        //
        // console.log(req.body);
        servicios.vehiculosChicos(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen vehiculos' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/vehiculostotal',
    function(req, res) {
        //
        // console.log(req.body);
        servicios.vehiculosTotal(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen vehiculos' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/tiposervicio',
    function(req, res) {
        //
        servicios.tipoServicio(sql, req.body)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen servicios definidos' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/conductoreschico',
    function(req, res) {
        //
        servicios.getConductoresChico(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen conductores' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/conductores',
    function(req, res) {
        //
        servicios.getConductores(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen conductores' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/conductor',
    function(req, res) {
        //
        servicios.addConductor(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al grabar conductor' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/borraconductor',
    function(req, res) {
        //
        servicios.delConductor(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al eliminar conductor' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/vehiculo',
    function(req, res) {
        //
        servicios.addVehiculo(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al grabar vehículo' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/borravehiculo',
    function(req, res) {
        //
        servicios.delVehiculo(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al eliminar vehiculo' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/empresastotal',
    function(req, res) {
        //
        servicios.empresasTotal(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen empresas' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/empresa',
    function(req, res) {
        //
        servicios.addEmpresa(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al grabar empresa' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/borraempresa',
    function(req, res) {
        //
        servicios.delEmpresa(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al eliminar empresa' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/usuariosxempresa',
    function(req, res) {
        //
        console.log(req.body);
        servicios.usuariosPorEmpresa(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen usuarios ligados a empresas.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/vehi2condu',
    function(req, res) {
        //
        console.log(req.body);
        servicios.vehiculos2Conductores(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen vehiculos ligados a conductores.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/vehi2condu',
    function(req, res) {
        //
        console.log(req.body.data);
        servicios.addVehiculo2Conductor(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen vehiculos ligados a conductores.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.get('/tarifas',
    function(req, res) {
        //
        servicios.Tarifas(sql)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen tarifas definidas.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/tarifas',
    function(req, res) {
        //
        console.log(req.body.data);
        servicios.addTarifa(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'No existen tarifas definidas.' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });
app.post('/borratarifa',
    function(req, res) {
        //
        servicios.delTarifa(sql, req.body.data)
            .then(function(data) {
                try {
                    res.json({ resultado: "ok", datos: data });
                } catch (error) {
                    res.status(500).json({ resultado: 'error', datos: 'Error al eliminar Tarifa' });
                }
            })
            .catch(function(error) {
                res.status(500).json({ resultado: 'error', datos: error });
            });
    });