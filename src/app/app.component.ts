import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'daw-ecommerce-grupo-8';

  // En el archivo app.component.ts
mostrar: boolean = false;

mostrarAppBody() {
  this.mostrar = !this.mostrar;
}
}
