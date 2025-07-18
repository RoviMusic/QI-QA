import { ReactNode } from "react";

export type ValueType = {
    value: string | number;
    label: string | ReactNode;
}

export type AddressType = {
    id: string;
    street: string;
    
}