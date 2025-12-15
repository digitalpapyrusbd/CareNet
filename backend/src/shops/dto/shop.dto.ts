import {
  IsString,
  IsDecimal,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateShopDto {
  @IsString()
  shop_name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  logo_url?: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDecimal()
  price: number;

  @IsNumber()
  stock_quantity: number;

  @IsArray()
  @IsOptional()
  image_urls?: string[];

  @IsString()
  category: string;
}

export class CreateOrderDto {
  @IsString()
  shop_id: string;

  @IsArray()
  items: Array<{
    product_id: string;
    quantity: number;
  }>;

  @IsString()
  delivery_address: string;
}
