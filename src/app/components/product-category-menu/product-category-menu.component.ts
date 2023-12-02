//Importar
import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  //ProductCategory viene de common/productcategory
  productCategories: ProductCategory[] = [];

  //constructor llamando a services/productServices
  constructor(private productService: ProductService){

  }


  ngOnInit() {
    this.listProductCategories();
  }
 

  //Declarar metodo
  listProductCategories() {
    //Invocar el Services
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories' + JSON.stringify(data));
        //ProductCategories linea 14
        this.productCategories = data;
      }
    );
  }

}
