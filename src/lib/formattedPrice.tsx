export const formattedPrice = (price: number) => {
  //format the complete price
  const fullPrice = price?.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // separate the symbol and the number
  const currencySymbol = fullPrice.charAt(0);
  const priceWithoutSymbol = fullPrice.substring(1);

  // separate the integer and decimal parts
  const [integerPart, decimalPart] = priceWithoutSymbol.split(".");

  //  return the JSX
  return (
    <span className="price-container">
      <span className="mr-2">{currencySymbol}</span>
      <span>{integerPart}</span>
      <sup className="text-lg ml-1">{decimalPart || "00"}</sup>
    </span>
  );
};

export const formattedPriceNormalized = (price: number) => {
  return price?.toLocaleString("ex-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
