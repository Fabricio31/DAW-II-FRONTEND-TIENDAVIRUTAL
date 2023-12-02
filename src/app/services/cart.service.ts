import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  //Array
  cartItems: CartItem[] = [];

  /* Nota: Subject es una subclase de Observable*/



  selectedGames: string[] = [];

  // Método para obtener los nombres de los juegos seleccionados
  
    getSelectedGameNames(): string[] {
    return this.selectedGames;
  }


  // Nuevo método para obtener el nombre del juego seleccionado
  getSelectedGameName(): string | undefined {
    // Obtén el último item del carrito (asumiendo que es el juego seleccionado)
    const selectedGame = this.cartItems[this.cartItems.length - 1];
    return selectedGame ? selectedGame.name : undefined;
  }

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //Al refrescar pagina web no perder datos 241
  // storage: Storage = sessionStorage; // Referencia a navegador web session storage, al actualizar pagina y/o ingresar los items quedan guardados, al volver a ingresar app no se guarda
  storage: Storage = localStorage; // al salir y volver a ingresar data se sigue guardando


  constructor() {

    // leer datos de la memoria
    let data = JSON.parse(this.storage.getItem('cartItems')!); //cartItems es la key
    if (data != null) {
      this.cartItems = data;
     //calcular totales basados en los datos que se leen del almacenamiento
      this.computeCartTotals();
    }

  }

  /*Para añadir al carro*/
  addToCart(event: Event, theCartItem: CartItem) {
    event.preventDefault();
    //1.Comprobar si ya tenemos un artículo en el carrito
    let alredyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined; 

    if (this.cartItems.length > 0) {
      //2.Encuentra el artículo en el carrito basado en el id del artículo
      /*
            Find = devuelve el primer elemento que pase
            Else = devuelve Undefined
            tempCartItem.id ==== theCartItem(parametro).id = Ejecuta el test para cada elemento del array unitl test pasa
      */
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)
      //3.comprobar si lo hemos encontrado
      alredyExistsInCart = (existingCartItem != undefined);
    }

    if (alredyExistsInCart) {
     //aumentar la cantidad
      existingCartItem.quantity++;
    }
    else {
      // simplemente añade el elemento al array
      this.cartItems.push(theCartItem);
    }

    //Calcular el precio total del carrito y la cantidad total
    this.computeCartTotals();
    // Almacena el nombre del juego en el registro
    this.selectedGames.push(theCartItem.name);
  }
  /*Calcula el total*/
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    //Calcular total
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

   //publicar los nuevos valores ... todos los abonados recibirán los nuevos datos
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //registrar datos del carro solo para depurar porpuses
    this.logCartData(totalPriceValue, totalQuantityValue);

    //Al refrescar pagina web mantiene los items
    this.persistCartItems();

  }

  //Al refrescar pagina web mantiene los items
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems)); //JSON.stringify = convierte el objeto a JSON string, porque api solo funciona
    //para cadenas claves y valores
  }



  /*Para mostrar en consola*/
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice},
      subtotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity:${totalQuantityValue}`) //Dos dígitos después del decimal 123.99
    console.log(`---`);

  }

  /*Metodo disminuir productos*/
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
   //Obtener el índice del elemento en la matriz
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    //Si se encuentra elimina el elemento del array en el índice dado
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }


}
