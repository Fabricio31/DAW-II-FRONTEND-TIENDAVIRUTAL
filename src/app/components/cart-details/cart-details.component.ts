import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {

  /*Array*/
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  /*Inyectar Dependencias*/
  constructor(private cartService: CartService) {}
  ngOnInit(): void {
    this.listCartDetails();
  }

  /*Declarar metodo*/
  listCartDetails() {
    //1.Obtener un handle de los artículos del carrito
        this.cartItems = this.cartService.cartItems;
    //2.Suscribirse al carrito totalPrice
        this.cartService.totalPrice.subscribe(
          data => this.totalPrice = data
        )
    //3.Suscribirse al carrito totalCantidad
          this.cartService.totalQuantity.subscribe(
            data => this.totalQuantity = data
          );
    //4.Calcular el precio total del carrito y la Cantidad
            this.cartService.computeCartTotals();

  }
  /*Metodo para buton + en Detalles de compra html*/
  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(event,theCartItem);
  }
/*Metodo para buton - en Detalles de compra html*/
  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }
  /*Metodo para eliminar producto*/
  remove(theCartItem: CartItem){
    this.cartService.remove(theCartItem);
  }
}
