export type ProcessorType = {
    meli: StatusProcessorType | null;
    amazon: StatusProcessorType | null;
    wl: StatusProcessorType | null;
    cop: StatusProcessorType | null;
}

export type StatusProcessorType = {
    pending: DataProcessorType[];
    processed: DataProcessorType[];
    error: DataProcessorType[];
}

export type DataProcessorType = {
    sale_id: string;
    sale_date: Date | null;
    message: string;
    order_items: [{sku: string; requested_quantity: number}];
    order?: any;
    order_reference?: string[] | string,
    market?: "Mercado Libre" | "Amazon" | "Walmart" | "Coppel";
}

export const dummyData: ProcessorType = {
    meli: {
        pending: [
            {
                sale_id: '19292929292',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '34535435',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '3453334',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '23443543435',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '4356345634534',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '23587978',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            }
        ],
        processed: [
            {
                sale_id: '789789',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '8790784',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '45764757565',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '657657575',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '9789807890',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '235345378',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            }
        ],
        error: [
            {
                sale_id: '43765876878',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '7894654554',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '345438987',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '23543399879',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '4555879978',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            },
            {
                sale_id: '4565678987',
                sale_date: new Date(),
                message: 'Orden pendiente',
                order_items: [
                    {
                        sku: '111111',
                        requested_quantity: 1
                    }
                ]
            }
        ]
    },
    amazon: null,
    cop: null,
    wl: null
}