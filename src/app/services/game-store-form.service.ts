import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameStoreFormService {

  //Añadiendo metodos a los form para meses y años
  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {


    let data: number[] = [];

    //Crear un arrat para el dropDownList de Mes
    //Comienza en el mes actual

    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    //of es operador de rxjs esto will wrap an object as an Observable
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    //Crear un array para años
    //Empieza en año actual

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data);

  }



}
