import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BusscarProdutoService } from './busscar_produto.service';
import { CreateBusscarProdutoDto } from './dto/create-busscar_produto.dto';
import { UpdateBusscarProdutoDto } from './dto/update-busscar_produto.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('busscar-produto')
export class BusscarProdutoController {
  constructor(private readonly busscarProdutoService: BusscarProdutoService) {}


  @Get("searchMaterial")
  @ApiQuery({ name: 'material', required: true, type: String, description: 'Material to search in CNBS' })
  @ApiQuery({ name: 'estado', required: false, type: String, description: 'State filter for results' })
  findAll(
    @Query('material') material: string,
    @Query('estado') estado?: string,
  ) {
    return this.busscarProdutoService.search_on_cnbs_material(material, undefined, undefined, estado);
  }

  @Get("searchCodigoPdm")
  @ApiQuery({ name: 'codigo_pdm', required: true, type: String, description: 'Codigo item to search in CNBS' })
  findByCodigoItem(
    @Query('codigo_pdm') codigo_pdm: string
  ) {
    return this.busscarProdutoService.search_on_cnbs_codigo_item(codigo_pdm);
  }

  @Get("searchDadosAbertosCompras")
  @ApiQuery({ name: 'codigoItemCatalogo', required: true, type: String, description: 'Codigo item to search in Dados Abertos Compras' })
  @ApiQuery({ name: 'tamanhoPagina', required: false, type: Number, description: 'Page size for results' })
  @ApiQuery({ name: 'pagina', required: false, type: Number, description: 'Page number for results' })
  @ApiQuery({ name: 'estado', required: false, type: String, description: 'State filter for results' })
  findByDadosAbertosCompras(
    @Query('codigoItemCatalogo') codigoItemCatalogo: string,
    @Query('tamanhoPagina') tamanhoPagina?: number,
    @Query('pagina') pagina?: number,
    @Query('estado') estado?: string,
  ) {
    return this.busscarProdutoService.search_on_dados_abertos_compras(codigoItemCatalogo, tamanhoPagina, pagina, estado);
  }

}