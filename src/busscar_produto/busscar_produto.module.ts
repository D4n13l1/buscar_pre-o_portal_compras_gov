import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BusscarProdutoService } from './busscar_produto.service';
import { BusscarProdutoController } from './busscar_produto.controller';

@Module({
  imports: [HttpModule],
  controllers: [BusscarProdutoController],
  providers: [BusscarProdutoService],
})
export class BusscarProdutoModule {}
