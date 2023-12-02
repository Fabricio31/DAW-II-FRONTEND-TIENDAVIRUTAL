export class OrderHistory {

    constructor(public id: string,
                public orderTrackingNumber: string,
                public totalPrice: number,
                public totalQuantity: number,
                public dateCreated: Date) {

                }
}


//Datos que se van a mostrar en el btn de Order History cuando el usuario este logueado
