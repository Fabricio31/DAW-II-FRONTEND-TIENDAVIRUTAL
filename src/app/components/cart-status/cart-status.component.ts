import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status', //copiar esto y pegar en app component html remplazando por el div de carro de compra estatico
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number =0;  

 /*Inyectar el CartService*/
  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  /*Implementar metodo updateCartStatus*/
  updateCartStatus() {
   //1.Suscribirse al carrito totalPrecio
        this.cartService.totalPrice.subscribe(
          data => this.totalPrice = data
        );
    //2.Suscribirse al carrito totalCantidad
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }

}
