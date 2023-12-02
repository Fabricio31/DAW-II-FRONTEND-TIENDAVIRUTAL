import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { PortalGamerFormService } from 'src/app/services/portal-gamer-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { PortalGamerValidators } from 'src/app/validators/portal-gamer-validators';
import { CartService } from 'src/app/services/cart.service';
import { Subject } from 'rxjs';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { Order } from 'src/app/common/order';

import { MatDialog } from '@angular/material/dialog';
import { OrderConfirmationModalComponent } from '../order-confirmation-modal/order-confirmation-modal.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  theEmail: string = '';

  //Para mostrar 1 juego
  selectedGameName: string | undefined;
  selectedGameNames: string[] = [];

  //Mostrar fecha
  currentDate: Date = new Date();

  //Mostrar tipo de tarjeta
  selectedCardType: string | undefined;

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  //referencia de sesion
  storage: Storage = sessionStorage;

  constructor(
    private formBuilder: FormBuilder,
    private PortalGamerFormService: PortalGamerFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    // leer la dirección de correo electrónico del usuario del almacenamiento del navegador
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    this.theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // Obtén el nombre del juego seleccionado
    this.selectedGameName = this.cartService.getSelectedGameName();

    // Obtén todos los nombres de los juegos seleccionados
    this.selectedGameNames = this.cartService.getSelectedGameNames();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),

        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),

        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          PortalGamerValidators.notOnlyWhitespace,
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}'),
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}'),
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    // rellenar los meses de la tarjeta de crédito

    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.PortalGamerFormService.getCreditCardMonths(startMonth).subscribe(
      (data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // rellenar los años de la tarjeta de crédito

    this.PortalGamerFormService.getCreditCardYears().subscribe((data) => {
      console.log('Retrieved credit card years: ' + JSON.stringify(data));
      this.creditCardYears = data;
    });

   //rellenar países

    this.PortalGamerFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
  }

  reviewCartDetails() {
    // suscribirse a cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      (totalQuantity) => (this.totalQuantity = totalQuantity)
    );

    // suscribirse a cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      (totalPrice) => (this.totalPrice = totalPrice)
    );
  }

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      // corrección de errores en los estados
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // corrección de errores en los estados
      this.billingAddressStates = [];
    }
  }

  //Boton de comprar
  onSubmit() {
    console.log('Manejo del botón de envío');
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //Seleccionar tipo de tarjeta
    this.selectedCardType = this.checkoutFormGroup.get(
      'creditCard.cardType'
    ).value;
    // iniciar orden
    let order = new Order(this.totalQuantity, this.totalPrice);
    // obtener artículos del carrito
    const cartItems = this.cartService.cartItems;
    // crear orderItems a partir de cartItems
    // - metodo antiguo
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */
    // - nuevo metodo mas abreviado
    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) =>
        new OrderItem(
          tempCartItem.imageUrl!,
          tempCartItem.unitPrice!,
          tempCartItem.quantity,
          tempCartItem.id!
        )
    );
    // establecer compra
    let purchase = new Purchase();
    // rellenar compra - cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // rellenar compra - dirección de envío
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    // rellenar compra - dirección de facturación
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // rellenar compra - pedido y orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // llamar a la API REST a través de CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Tu compra ha sido un éxito!\n Tu Numero de Seguimiento es: ${response.orderTrackingNumber}`
        );

        // Vaciar carrito
        this.resetCart();

        // Abrir el diálogo después de reiniciar el carro
        this.dialog
          .open(OrderConfirmationModalComponent, {
            width: '500px', 
            data: { orderTrackingNumber: response.orderTrackingNumber },
          })
          .afterClosed()
          .subscribe(() => {
            // Ir a la página de éxito después de cerrar el diálogo
            // Verifica si theEmail tiene un valor antes de navegar
            this.resetCart();
            if (this.theEmail) {
              // Ir a la página de éxito después de cerrar el diálogo
              this.router.navigate([
                '/compraexitosa',
                { email: this.theEmail },
              ]);             
            } else {
              // Maneja la situación si theEmail no tiene un valor
              console.error(
                'No se pudo obtener el correo electrónico del usuario.'
              );             
            }
          });
      },
      error: (err) => {
        alert(`OPS, sucedió un error: ${err.message}`);
      },
    });
  }

  resetCart() {
    // vaciar data de carrito
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // resetea datos del formulario
    this.checkoutFormGroup.reset();

    // volver a la página de productos
    this.router.navigateByUrl('/products');
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value.expirationYear
    );

   // si el año actual es igual al año seleccionado, entonces empieza por el mes actual

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.PortalGamerFormService.getCreditCardMonths(startMonth).subscribe(
      (data) => {
        console.log('Retrieved credit card months: ' + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.PortalGamerFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      // seleccionar el primer elemento por defecto
      formGroup.get('state').setValue(data[0]);
    });
  }
}
