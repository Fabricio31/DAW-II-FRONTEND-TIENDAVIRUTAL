import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  //Nueva propiedad
  product!: Product;

  //Inyeccion
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  //Metodo
  handleProductDetails() {
    // Obtener el id param cadena. Convertir cadena en número utilizando el símbolo +.
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe((data) => {
      this.product = data;
    });
  }

  //Boton 
  addToCart(){
      console.log(`Adding to cart: ${this.product.name}, ${this.product.unit_price}`);
      const theCartItem = new CartItem(this.product);
      this.cartService.addToCart(event,theCartItem);
  }


}
