export interface ProductColumns {
  name: string,
  id: number,
  price: number,
  images: string[],
  model: string
}

export const PRODUCT_DATA: ProductColumns[] = [
  {
    name: 'Wooden Chair',
    id: 1,
    price: 49.99,
    images: ['chair1.jpg', 'chair2.jpg'],
    model: 'CH-101',
  },
  {
    name: 'Modern Sofa',
    id: 2,
    price: 299.99,
    images: ['sofa1.jpg', 'sofa2.jpg', 'sofa3.jpg'],
    model: 'SO-202'
  },
  {
    name: 'Office Desk',
    id: 3,
    price: 150.00,
    images: ['desk1.jpg', 'desk2.jpg'],
    model: 'DK-303'
  },
  {
    name: 'Dining Table',
    id: 4,
    price: 199.99,
    images: ['table1.jpg', 'table2.jpg', 'table3.jpg'],
    model: 'DT-404'
  },
  {
    name: 'Bookshelf',
    id: 5,
    price: 89.99,
    images: ['shelf1.jpg'],
    model: 'BS-505'
  },
  {
    name: 'Recliner Chair',
    id: 6,
    price: 120.00,
    images: ['recliner1.jpg', 'recliner2.jpg'],
    model: 'RC-606'
  },
  {
    name: 'Coffee Table',
    id: 7,
    price: 75.50,
    images: ['coffee1.jpg'],
    model: 'CT-707'
  },
  {
    name: 'Bed Frame',
    id: 8,
    price: 250.00,
    images: ['bed1.jpg', 'bed2.jpg'],
    model: 'BF-808'
  },
  {
    name: 'Wardrobe',
    id: 9,
    price: 180.75,
    images: ['wardrobe1.jpg', 'wardrobe2.jpg'],
    model: 'WD-909'
  },
  {
    name: 'Nightstand',
    id: 10,
    price: 45.00,
    images: ['nightstand1.jpg'],
    model: 'NS-1010'
  }
];

