import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/products'; //por default angular muestra 20 items

  private categoryUrl = 'http://localhost:8080/api/product-category'; //Url de productsCategoria

  //Inyectar HttpClient
  constructor(private httpClient: HttpClient) { }

  //Nuevo Metodo
  getProduct(theProductId: number): Observable<Product> {

    // Se necesita crear URL basado en el producto ID
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  //Paginacion
  getProductListPaginate(thePage: number, 
                         thePageSize: number, 
                         theCategoryId: number): Observable<GetResponseProducts> {

   //URL basado en category id, pagina y tamaño
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

//Nuevo Metodo
  getProductList(theCategoryId: number): Observable<Product[]> {

   //Spring automaticamente exposes endpoint
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
  // //Retorna un Observable, mapea el data JSON desde el proyecto de Spring Data Rest al Array
    // //_embedded tiene los datos de api/products
    // return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
    //   map(response => response._embedded.products)
    // );
    return this.getProducts(searchUrl);
  }

//Metodo para searchbar
  searchProducts(theKeyword: string): Observable<Product[]> {
    // necesidad de crear una URL basada en la palabra clave
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  
  //Paginacion por busqueda
  searchProductsPaginate(thePage: number, 
                        thePageSize: number, 
                        theKeyword: string): Observable<GetResponseProducts> {

    //URL basado en keyword, pagina y tamaño
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`;
    
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }



  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));
  }

  //Metodo de product-category-menu
  // getProductCategories(): Observable<ProductCategory[]> { //this.categoryUrl llama a REST API
  //   return this.httpClient.get<GetResponseProductsCategory>(this.categoryUrl).pipe(
  //     map(response => response._embedded.productCategory)//Retorna el observable mapea JSON de Spring a el array ProductCategory
  //   );
  // }


  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number, //Tamaño de Pagina
    totalElements: number, //Total general de TODOS los elementos de la base de datos, pero NO devolvemos todos los elementos, sólo el recuento.
    totalPages: number, //Total de paginas disponibles
    number: number //Pagina Actual
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}