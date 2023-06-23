import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getSingleProduct(@Param('id') id: number) {
    return this.productsService.getSingleProduct(id);
  }

  @Post()
  createNewProduct(@Body() dto: ProductsDto) {
    return this.productsService.createNewProduct(dto);
  }

  @Delete()
  deleteProduct() {}
}
