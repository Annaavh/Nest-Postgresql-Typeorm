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
}
