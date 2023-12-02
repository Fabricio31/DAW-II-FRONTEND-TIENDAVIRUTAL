export class Product {
    //1.Añadir constructor que contenga los datos de api de la entidad producto de la base de datos
    constructor(
        public id_product: number,
        public name: string,
        public sku: string,
        public description: string,
        //cambiando unitPrice x unit_price
        public unit_price: number,
         //cambiando image_url x image_url
        public image_url: string,
        //cambiando image_url x units_in_stock
        public units_in_stock: number,
         //cambiando date_created x units_in_stock
        public date_created: Date,
         //cambiando last_updated x units_in_stock
        public last_updated: Date ){
            
        }
}
