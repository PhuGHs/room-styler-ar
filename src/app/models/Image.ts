export interface Image {
  imageId: number,
  imageUrl: string,
}

export interface ProductImage {
  productId: number,
  image: Image,
  isMainImage: boolean
}

