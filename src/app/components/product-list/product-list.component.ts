import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
//Añadir
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  //Nombre que se va a referenciar en las paginas html
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  //Añadir nuevo metodo products que contenga un Array de los items de producto
  products: Product[] = [];

  //Añadir nueva propiedad para el currentCategoryId (1000 para consolas 2000 para juegos 3000 para accesorios)
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  //Añadir nuevo metodo para modo busqueda
  searchMode: boolean = false;

  //Nueva propiedad para paginacion
  thePageNumber: number = 1;
  thePageSize: number = 10; // 10 productos por pagina
  theTotalElements: number = 0;
  previousKeyword: string = '';

  //Inyecta el ProductoServices,tambien la ruta actual y el carro
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  //Similar a @PostConstruct
  ngOnInit(): void {
    //Añadimos ruta
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //Si tentemos un diferente keyword que el anterior devolver a pagina nro.1
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    //Buscar productos por la keywork
    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        theKeyword
      )
      .subscribe(this.processResult());
  }

  //Para busqueda en searchbar
  handleListProducts() {
    //Check si el parametro ID esta disponible
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id'); //retorna true o false
    if (hasCategoryId) {
      //Obtiene el parametro string id convirtiendolo a number usando el simbolo +
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //Si el id categoria no esta disponible ... default de categoria es id 2 = Juegos, 1 Consolas 2 Juegos 3 Accesorios
      this.currentCategoryId = 2;
    }
    //
    // Verificar si tenemos una diferente categoria que la anterior
    // Nota: Angular reutilizará un componente si está siendo visualizado en ese momento.
    //

    // si hay una diferente CategoryID
    // PageNumber a 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(
      `currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`
    );

    //Ahora obtendremos los productos de la respectiva categoria id
    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   //Cuando el metodo es invocado ...
    //   (data) => {
    //     //Asigna los resultados al Array Producto de la linea 18
    //     this.products = data;
    //   }
    // );
  }

  //Para dropdownlist
  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize; //+pageSize para cambiar a string
    this.thePageNumber = 1; //reseteo
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  //Metodo añadir al carrito
  addToCart(theProduct: Product){
    console.log(`Añadir al caro: ${theProduct.name}, ${theProduct.unit_price}`);
    //TODO ...
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(event,theCartItem);
  }
}
