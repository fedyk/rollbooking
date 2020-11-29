export function formatPrice(price: number, currencyCode: string) {
  if (currencyCode === "USD") {
    return "$" + price.toPrecision(2)
  }

  return price.toPrecision(2) + currencyCode
}
