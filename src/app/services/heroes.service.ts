import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, delay } from 'rxjs/operators';

import { HeroeModel } from '../models/heroe.model';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private url = 'https://loginapp-6566c.firebaseio.com/';

  constructor(private http: HttpClient) {}

  crearHeroe(heroe: HeroeModel) {
    return this.http.post(`${this.url}/heroes.json`, heroe).pipe(
      map((res: any) => {
        heroe.id = res.name;
        return heroe;
      })
    );
  }

  actualizarHeroe(heroe: HeroeModel) {
    /* ESTO ES SUPREMAMENTE IMPORTANTE */
    /* Aqui Vamos A Enviar el objeto con el ID, pero esto no es conveniente por que se guardaria en firebase un nuevo campo con el nombre del id, pero yo solo quiero actualizar los campo existente, por ende debo cortar la referencia de los objetos heroes que me estan llegando por parametro */

    /* Spread Operator Se va a crear las propiedades con el mismo nombre del objeto heroe que me esta llegando por parametro */

    /* Aqui Se rompe la referencia de JavaScript gracias a la constante heroeTemporal */
    const heroeTemporal = {
      ...heroe,
    };

    delete heroeTemporal.id;

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemporal);
  }

  getHeroe(id: string) {
    return this.http.get(`${this.url}/heroes/${id}.json`);
  }

  deleteHeroe(id: string) {
    return this.http.delete(`${this.url}/heroes/${id}.json`);
  }

  getHeroes() {
    return this.http
      .get(`${this.url}/heroes.json`)
      .pipe(
        map(
          /* (res) => this.pasarDeObjetoAarreglo(res) El Siguiente Es Un Tip Que Hace Lo Mismo Que esta Linea <=> */ this
            .pasarDeObjetoAarreglo,
          delay(1500)
        )
      );
  }

  private pasarDeObjetoAarreglo(allHeroesObject: object) {
    const heroes: HeroeModel[] = [];

    // console.log('Objeto Firebase', allHeroesObject);
    if (allHeroesObject === null) {
      return [];
    }

    /* Paso el objeto para obtener sus llaves(propiedades) posteriormente las puedo iterar y obtengo cada llave(propiedad) que se va a asignar a un hero de tipo HeroeModel */
    // console.log('Objeto Por Object.keys =>', Object.keys(allHeroesObject));
    Object.keys(allHeroesObject).forEach((keyPropiedadObject) => {
      // console.log(keyPropiedadObject);
      const heroe: HeroeModel = allHeroesObject[keyPropiedadObject];

      heroe.id = keyPropiedadObject;

      heroes.push(heroe);
    });

    return heroes;
  }
}
