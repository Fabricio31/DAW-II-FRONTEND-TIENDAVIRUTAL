import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Producto } from '../models/Productos';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  rutaGlobal = 'http://localhost:8080/rest-productos/'


  constructor(private http: HttpClient) { }

  //Crear Producto
    crearProducto(producto: Producto){
      return this.http.post<Producto>(this.rutaGlobal + 'nuevo', producto, {
          observe: 'response'
      })
    }
  //Obtener Producto
    getProductos(){
      return this.http.get<Producto[]>(this.rutaGlobal + 'mostrar')
    }
  //Actualizar Producto
    actualizarProducto(producto: Producto){
      return this.http.post<Producto>(this.rutaGlobal + 'update', producto, {
        observe: 'response'
      })
    }

  //Eliminar Producto
    eliminarProducto(id: number){
      this.http.post<Boolean>(this.rutaGlobal + id, {
        observe: 'response'
      })
    }
}
