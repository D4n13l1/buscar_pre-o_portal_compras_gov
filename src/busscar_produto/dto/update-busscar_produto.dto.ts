import { PartialType } from '@nestjs/mapped-types';
import { CreateBusscarProdutoDto } from './create-busscar_produto.dto';

export class UpdateBusscarProdutoDto extends PartialType(CreateBusscarProdutoDto) {}
