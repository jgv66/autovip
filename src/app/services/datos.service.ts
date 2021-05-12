import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  url = environment.API_URL;

  constructor( private http: HttpClient ) {
    //
    console.log('>>>> DatosService <<<<');
    this.url = environment.API_URL;
    //
  }

  postServicioWEB( cSP: string, data?: any, usuario?: any ) {
    // console.log(cSP);
    // console.log(parametros);
    const url  = this.url + cSP;
    const body = { data, usuario } ;
    return this.http.post( url, body,  );
  }

  getServicioWEB( cSP: string, parametros?: any ) {
    const params = new HttpParams().append('param', JSON.stringify(parametros));
    const url    = this.url + cSP;
    if ( parametros ) {
      return this.http.get( url, { params } );
    } else {
      return this.http.get( url );
    }
  }

  // set a key/value
  async guardarDato( key, value ) {
    await localStorage.setItem( key, JSON.stringify( value ) );
  }

  async leerDato( key ) {
    return await JSON.parse( localStorage.getItem( key ) );
  }

  uploadImage( imgb64, name, ext, idPaquete ) {
    //
    const url = this.url + '/imgUpload';
    //
    const formData = new FormData();
    formData.append('foto',      imgb64 );
    formData.append('name',      name);
    formData.append('extension', ext);
    formData.append('id_pqt',    idPaquete );
    //
    return this.http.post(url, formData);
  }

}
