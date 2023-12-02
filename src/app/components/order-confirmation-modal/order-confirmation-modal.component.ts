import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-confirmation-modal',
  template: `
    <h2>Orden Confirmada</h2>
    <p>Tu compra ha sido exitosa. Tu número de seguimiento es: {{ data.orderTrackingNumber }}</p>
    <img src="assets/portalgamer.png" alt="Success Icon" class="success-icon" />
    <button mat-button [mat-dialog-close]="'close'">Cerrar</button>
  `,
})
export class OrderConfirmationModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}