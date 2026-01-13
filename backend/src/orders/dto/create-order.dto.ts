export class CreateOrderDto {
    tableId: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}
