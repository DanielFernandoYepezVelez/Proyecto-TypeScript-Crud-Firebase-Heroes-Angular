import { Component, OnInit } from '@angular/core';

import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: HeroeModel[] = [];
  cargando = false;

  constructor(private heroeService: HeroesService) {}

  ngOnInit(): void {
    this.cargando = true;

    this.heroeService.getHeroes().subscribe((res) => {
      // console.log('Heroes convertidos en array => ', res);
      this.heroes = res;
      this.cargando = false;
    });
  }

  borrarHeroe(heroe: HeroeModel, index: number) {
    /* Podemos Eliminar Los Heroes De Dos Forma La Perezosa */
    /* this.heroeService.deleteHeroe(heroe.id).subscribe((res) => {
      console.log(res);
      this.ngOnInit(); Aqui Un Nuevo Request
    }); */

    /* Podemos Eliminar Los Heroes De Dos Forma La Correcta */
    Swal.fire({
      title: '¿Estas Seguro Que Desea Eliminar?',
      text: `Heroe Eliminado No Se Puede Recuperar`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((res: any) => {
      if (res.value) {
        this.heroes.splice(index, 1);
        this.heroeService.deleteHeroe(heroe.id).subscribe();
      }
    });
  }
}
