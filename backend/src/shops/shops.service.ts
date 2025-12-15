import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import {
  CreateShopDto,
  CreateProductDto,
  CreateOrderDto,
} from './dto/shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async createShop(userId: string, createDto: CreateShopDto) {
    const shop = await this.prisma.shops.create({
      data: {
        user_id: userId,
        shop_name: createDto.shop_name,
        description: createDto.description,
        logo_url: createDto.logo_url,
        address: createDto.address,
        is_verified: false,
      },
    });

    return shop;
  }

  async findAllShops(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [shops, total] = await Promise.all([
      this.prisma.shops.findMany({
        where: { is_verified: true },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.shops.count({ where: { is_verified: true } }),
    ]);

    return {
      data: shops,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneShop(id: string) {
    const shop = await this.prisma.shops.findUnique({
      where: { id },
      include: {
        products: {
          where: { is_active: true }, // is_active in schema
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return shop;
  }

  async createProduct(shopId: string, createDto: CreateProductDto) {
    const product = await this.prisma.products.create({
      data: {
        shop_id: shopId,
        name: createDto.name,
        description: createDto.description,
        price: createDto.price,
        stock_quantity: createDto.stock_quantity,
        category: createDto.category,
        image_urls: (createDto.image_urls as any) || [],
        is_active: true,
      },
    });

    return product;
  }

  async getShopProducts(shopId: string) {
    const products = await this.prisma.products.findMany({
      where: {
        shop_id: shopId,
        is_active: true,
      },
    });

    return products;
  }

  async createOrder(userId: string, createDto: CreateOrderDto) {
    let totalAmount = 0;

    for (const item of createDto.items) {
      const product = await this.prisma.products.findUnique({
        where: { id: item.product_id },
      });

      if (product) {
        totalAmount += Number(product.price) * item.quantity;
      }
    }

    const order = await this.prisma.orders.create({
      data: {
        shop_id: createDto.shop_id,
        customer_id: userId,
        total_amount: totalAmount,
        shipping_address: createDto.delivery_address, // shipping_address in schema
        status: 'PENDING',
        items: createDto.items as any,
      },
    });

    return order;
  }

  async getOrders(userId: string) {
    const orders = await this.prisma.orders.findMany({
      where: { customer_id: userId },
      include: {
        shop: { select: { shop_name: true } }, // shop singular in relation? Check schema: 'shop shops'
      },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.orders.update({
      where: { id: orderId },
      data: { status },
    });

    return order;
  }
}
