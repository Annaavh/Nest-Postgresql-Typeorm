import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entity/products.entity';
import { Repository } from 'typeorm';
import { ProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async getAllProducts() {
    return await this.productsRepository.find();
  }
  async getSingleProduct(id: number) {
    return await this.productsRepository.findBy({ id });  
  }
  async createNewProduct(dto: ProductsDto) {
    const newProduct = await this.productsRepository.create(dto);
    await this.productsRepository.save(newProduct);
    return newProduct;
  }
  async deleteProduct(id: number) {
    const result = await this.productsRepository.delete({ id });
    if (result.affected) return { message: 'Deleted successfully!' };
  }
  async updateProduct(userId: number, dto: ProductsDto) {
    return await this.productsRepository.update(userId, { ...dto });
  }
}
