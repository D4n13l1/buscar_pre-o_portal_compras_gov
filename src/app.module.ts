import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusscarProdutoModule } from './busscar_produto/busscar_produto.module';

@Module({
  imports: [BusscarProdutoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
