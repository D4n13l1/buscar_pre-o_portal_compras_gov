import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BusscarProdutoService {
  constructor(private readonly httpService: HttpService) { }

  async search_on_cnbs_material(material: string, tamanhoPagina?: number | 10, pagina?: number | 1, estado?: string): Promise<any> {
    const url = 'https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/palavra';
    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        params: { palavra: material },
        timeout: 5000,
      });

      const firstItem = Array.isArray(data) ? data[0] : data;
      const codigoPdm = firstItem?.codigoPdm ?? firstItem?.codigoPDM ?? firstItem?.codigo_pdm;

      if (codigoPdm) {
        const codigoData = await this.search_on_cnbs_codigo_item(String(codigoPdm));

        const codigoArray = Array.isArray(codigoData) ? codigoData : [codigoData];

        let ultimoDadosCompras: any = null;
        for (const codigoObj of codigoArray) {
          const codigoItem = codigoObj?.codigoItem ?? codigoObj?.codigo_item ?? codigoObj?.codigo;
          if (!codigoItem) continue;

          const dadosCompras = await this.search_on_dados_abertos_compras(
            String(codigoItem),
            tamanhoPagina,
            pagina,
            estado,
          );

          ultimoDadosCompras = dadosCompras;

          const resultado = dadosCompras?.data?.resultado;
          if (Array.isArray(resultado) && resultado.length > 0) {
            return { valores: dadosCompras, codigoItemUsed: String(codigoItem) };
          }
          const totalRegistros = dadosCompras?.data?.totalRegistros ?? dadosCompras?.data?.total_registros;
          if (typeof totalRegistros === 'number' && totalRegistros > 0) {
            return { valores: dadosCompras, codigoItemUsed: String(codigoItem) };
          }

        }

        if (ultimoDadosCompras) {
          return { material: data, codigoData, valores: ultimoDadosCompras };
        }

        return { material: data, codigoData };
      }

      return { material: data };
    } catch (error) {
      const msg = error?.response?.data ?? error?.message ?? error;
      throw new Error(`Erro ao buscar CNBS: ${msg}`);
    }
  }

  async search_on_cnbs_codigo_item(codigoPdm: string) {
    const url = 'https://cnbs.estaleiro.serpro.gov.br/cnbs-api/material/v1/materialCaracteristcaValorporPDM';
    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        params: { codigo_pdm: codigoPdm },
        timeout: 5000,
      });
      return data;
    }
    catch (error) {
      const msg = error?.response?.data ?? error?.message ?? error;
      throw new Error(`Erro ao buscar CNBS: ${msg}`);
    }
  }

  async search_on_dados_abertos_compras(codigoItemCatalogo: string, tamanhoPagina?: number | 10, pagina?: number | 1, estado?: string) {
    const url = 'https://dadosabertos.compras.gov.br/modulo-pesquisa-preco/1_consultarMaterial'
    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        params: {
          codigoItemCatalogo,
          tamanhoPagina,
          pagina,
          estado
        },
        timeout: 5000,
      });
      return { data };
    } catch (error) {
      const msg = error?.response?.data ?? error?.message ?? error;
      throw new Error(`Erro ao buscar CNBS: ${msg}`);
    }
  }

}
