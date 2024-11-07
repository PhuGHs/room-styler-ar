import { ProductImage } from "./Image";

export interface Product {
  productId: number,
  productName: string,
  price: number,
  images: ProductImage[],
  spec: string,
  desc: string,
}
