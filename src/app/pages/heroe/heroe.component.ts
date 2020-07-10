import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';
import { HeroeModel } from '../../models/heroe.model';
import { HeroesService } from '../../services/heroes.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css'],
})
export class HeroeComponent implements OnInit {
  heroe: HeroeModel = new HeroeModel();

  constructor(
    private heroeService: HeroesService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // const id = this.activatedRouter.params.subscribe(res => console.log(res));
    /* Otra Forma Sin Necesidad De Suscribirme */
    const id = this.activatedRouter.snapshot.paramMap.get('id');

    if (id !== 'heroe_id') {
      this.heroeService.getHeroe(id).subscribe((res: HeroeModel) => {
        (this.heroe = res), (this.heroe.id = id);
      });
    }
  }

  guardar(formulario: NgForm) {
    /* console.log(this.heroe);
    console.log(formulario); */

    if (formulario.invalid) {
      // console.log('Formulario No Válido');
      // console.log(Object.values(formulario.controls));

      Object.values(formulario.controls).forEach((inputControl) => {
        // console.log(inputControl);
        inputControl.markAsTouched();
      });

      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando Información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    /* Reactive Extensions */
    /* Una Variable De Tipo Observable, Pendiente De Lo Que Me Retorne El Servicio */
    let peticion: Observable<any>;
    // console.log(this.heroe.id);

    if (this.heroe.id) {
      peticion = this.heroeService.actualizarHeroe(this.heroe);
    } else {
      peticion = this.heroeService.crearHeroe(this.heroe);
    }

    /* Aqui Se Suscribe Al Retorno Del Servicio Especificamente Del RxJs(map) */
    peticion.subscribe((res) => {
      /* No es necesario asignar el res al this.heroe por se pasa el dato por referencia, pero se debe tener encuenta esta parte, por que estoy retornando un heroe, que es el mismo que envia crear o actualizar */
      // console.log(res);
      // console.log(this.heroe);
      // this.heroe = res;
      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se Actualizo Correctamente',
        icon: 'success',
      });
    });

    formulario.reset();
  }
}
