import { useState } from 'react';
import { Tabela } from './Tabela';
import styles from './mainContent.module.css';
import {
  Product,
  Pack,
  ProductOrPack,
  ApiResponse } from '../../../utils/Types/ResponseType';

export function MainContent() {
  const [file, setFile] = useState<File | null>(null);

  const [mistake, setMistake] = useState<string[] | null>(null);

  const [validatedProducts,
    setValidatedProducts] = useState<ProductOrPack[] | null>(null);

  const [isValid, setIsValid] = useState<boolean | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }
  const processResponse = (response: ApiResponse) => {
    const flattenedResponse = response.flat();

    const products = flattenedResponse
      .filter((item: Product | Pack) => item.status === 'success' && 'product' in item);

    const packs = flattenedResponse
      .filter((item: Product | Pack) => item
        .status === 'success' && 'pack' in item && item.pack.code > 999);

    const errors = flattenedResponse
      .filter((item: Product | Pack) => item.status === 'error');

    return { items: products.length > 0 ? products : packs, errors };
  };

  async function handleValidation() {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3003/readcsv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (typeof data === 'object' && 'message' in data) {
        setMistake([data.message]);
      }
      const { items, errors } = processResponse(data);
      setValidatedProducts(items);
      setMistake(errors.map((errorItem) => {
      // Verificando se 'message' existe no objeto de erro
        if ('error' in errorItem) {
          return errorItem.error as string;
        }
        // Caso contrário, retorna apenas o status
        return `Status: ${errorItem.status}, `;
      }));

      setIsValid(true);
    } catch (error) {
      console.error('Erro ao validar o arquivo:', error);
    }
  }
  return (
    <main className={ styles.main }>
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={ handleFileChange }
          className={ styles.input }
        />
        <button
          className={ !file ? styles.buttonDisabled : styles.button }
          onClick={ handleValidation }
          disabled={ !file }
        >
          Validar Arquivo
        </button>
      </div>
      <Tabela products={ validatedProducts } errors={ mistake } />
      <button
        className={ styles.button }
        disabled={ !isValid }
      >
        Atualizar Produtos
      </button>
    </main>
  );
}
