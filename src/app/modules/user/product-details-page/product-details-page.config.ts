import { Product } from "@app/models/Product";

export const SAMPLE_PRODUCT: Product = {
  productId: 1,
  productName: 'Folding table with 4 chairs around (Stainless steel)',
  price: 981000,
  images: [
    {
      productId: 1,
      image: {
        imageId: 1,
        imageUrl: 'https://www.ikea.com/us/en/images/products/linnmon-tabletop-white__1097492_pe864988_s5.jpg?f=xl'
      },
      isMainImage: true,
    },
    {
      productId: 2,
      image: {
        imageId: 2,
        imageUrl: 'https://www.ikea.com/us/en/images/products/linnmon-tabletop-white__0734654_pe739562_s5.jpg?f=xl'
      },
      isMainImage: false,
    },
    {
      productId: 3,
      image: {
        imageId: 3,
        imageUrl: 'https://www.ikea.com/us/en/images/products/linnmon-tabletop-white__0851377_pe630213_s5.jpg?f=xl'
      },
      isMainImage: false,
    },
    {
      productId: 4,
      image: {
        imageId: 4,
        imageUrl: 'https://www.ikea.com/us/en/images/products/linnmon-tabletop-white__1160178_pe888787_s5.jpg?f=xl'
      },
      isMainImage: false,
    }
  ],
  desc: 'Description',
  spec: 'Specification'
}
