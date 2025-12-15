import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ShopsService } from './shops.service';
import {
  CreateShopDto,
  CreateProductDto,
  CreateOrderDto,
} from './dto/shop.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  @Roles(UserRole.SHOP_ADMIN)
  createShop(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateShopDto,
  ) {
    return this.shopsService.createShop(userId, createDto);
  }

  @Public()
  @Get()
  findAllShops(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.shopsService.findAllShops(+page, +limit);
  }

  @Public()
  @Get(':id')
  findOneShop(@Param('id') id: string) {
    return this.shopsService.findOneShop(id);
  }

  @Post(':id/products')
  @Roles(UserRole.SHOP_ADMIN, UserRole.SHOP_MANAGER)
  createProduct(
    @Param('id') shopId: string,
    @Body() createDto: CreateProductDto,
  ) {
    return this.shopsService.createProduct(shopId, createDto);
  }

  @Public()
  @Get(':id/products')
  getShopProducts(@Param('id') shopId: string) {
    return this.shopsService.getShopProducts(shopId);
  }

  @Post('orders')
  createOrder(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateOrderDto,
  ) {
    return this.shopsService.createOrder(userId, createDto);
  }

  @Get('orders/my-orders')
  getMyOrders(@CurrentUser('id') userId: string) {
    return this.shopsService.getOrders(userId);
  }

  @Patch('orders/:id/status')
  @Roles(UserRole.SHOP_ADMIN, UserRole.SHOP_MANAGER)
  updateOrderStatus(
    @Param('id') orderId: string,
    @Body() body: { status: string },
  ) {
    return this.shopsService.updateOrderStatus(orderId, body.status);
  }
}
