/* eslint-disable @typescript-eslint/naming-convention */
import { Pack, Product, ProductOrPack } from '../../../../utils/Types/ResponseType';
import styles from './tabela.module.css';

function extractItemDetails(item: Product | Pack) {
  if ('product' in item) {
    return item.product;
  }
  return item.pack;
}

export function Tabela({ products, errors }:
{ products: ProductOrPack[] | null, errors: string[] | null }) {
  if (!products && !errors) {
    return <div className={ styles.waiting }>Aguardando envio de arquivo...</div>;
  }

  return (
    <div>
      {errors && errors.length > 0 && (
        <div>
          <h2>Erros encontrados:</h2>
          <ul>
            {errors.map((error, index) => (
              <li key={ index }>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {products && products.length > 0 && (
        <div className={ styles.table }>
          <h3>Os seguintes preços serão atualizados:</h3>
          <table className={ styles.table }>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço de custo</th>
                <th>Preço de venda</th>
                <th>Novo preço</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item: Product | Pack) => {
                const { code, name,
                  cost_price, sales_price, new_price } = extractItemDetails(item);

                return (
                  <tr key={ code }>
                    <td>{code}</td>
                    <td>{name}</td>
                    <td>
                      R$
                      {cost_price}
                    </td>
                    <td>
                      R$
                      {sales_price}
                    </td>
                    <td>
                      R$
                      {new_price.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
