export enum LogisticTypeEnum {
    Full = "Full",
    FBA = "Fulfillment by Amazon",
    CS = "Custom Shippment",
    DS = "Dropshipping",
    CD = "Cross Docking",
}

export type LogisticType = keyof typeof LogisticTypeEnum;