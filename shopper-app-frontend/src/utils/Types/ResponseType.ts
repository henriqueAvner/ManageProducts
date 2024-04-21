export type Product = {
  status: string;
  product: {
    code: number;
    name: string;
    quantity: number;
    cost_price: string;
    sales_price: string;
    new_price: number;
  };
};

export type Pack = {
  status: string;
  pack: {
    code: number;
    name: string;
    cost_price: string;
    sales_price: string;
    new_price: number;
  };
};

export type ApiResponse = (Product | Pack)[];

export type ProductOrPack = Product | Pack;
