import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage; //referencia a session storeage en el navegador

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

   // Suscribirse a los cambios de estado de autenticación
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {

      // Obtener los datos del usuario conectado
      //
      // el nombre completo del usuario se expone como nombre de propiedad
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;

          //recuperar el correo electrónico del usuario de la respuesta de autenticación
          const theEmail = res.email;

          // ahora almacenar el correo electrónico en el almacenamiento del navegador
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    // Finaliza la sesión con Okta y elimina los tokens actuales.
    this.oktaAuth.signOut();
  }

}