import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';

//Importar
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ProductService } from './services/product.service';
import { Routes, RouterModule, Router} from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import  { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';



import {
  OktaAuthModule,
  OktaCallbackComponent,
  OKTA_CONFIG, 
  OktaAuthGuard
} from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { OrderConfirmationModalComponent } from './components/order-confirmation-modal/order-confirmation-modal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'primeng/dialog';
import { OrdenExitosaComponent } from './components/orden-exitosa/orden-exitosa.component';


const oktaConfig = myAppConfig.oicd;

const oktaAuth = new OktaAuth(oktaConfig);

//Funcion para sendToLoginPage
function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector){
  //Utilice el inyector para acceder a cualquier servicio disponible en su aplicación
  const router = injector.get(Router);
  //Redirigir al usuario a su página de inicio de sesión personalizada
  router.navigate(['/login'])
}


//Definir Rutas para buscar x categoria
const routes: Routes = [
  //El orden en que se definan las rutas importa, desde el mas especifico a las generico


  { path: 'compraexitosa', component: OrdenExitosaComponent },

  {path: 'order-history', component: OrderHistoryComponent, canActivate: [OktaAuthGuard],data: {onAuthRequired: sendToLoginPage}},

  {path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard],data: {onAuthRequired: sendToLoginPage}},
  //Para iniciar sesion
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  //Parametro para buscar
  {path: 'search/:keyword', component: ProductListComponent},
  //por id
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  //Si no se encuetra redireccionar a products
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},

];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    HomeComponent,
    HeaderComponent,
    BodyComponent,
    OrderConfirmationModalComponent,
    OrdenExitosaComponent,
  
  ],
  imports: [
    //Añadir para las rutas
    RouterModule.forRoot(routes),
    BrowserModule,
    //Añadir para el Http
    HttpClientModule,
    //Añadir ng-bootstrap
    NgbModule,
    //Añadir ReactiveFormsModule
    ReactiveFormsModule,
    //Añadir okta referencia, error hacer update de version -->  updated the version of Okta-angular version 6.2.0, the error is gone
    OktaAuthModule ,
    MatButtonModule,
    MatDialogModule,
    DialogModule 
  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: { oktaAuth }},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
