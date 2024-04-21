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

  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }
  const processResponse = (response: ApiResponse) => {
    const flattenedResponse = response.flat();

    const products = flattenedResponse
      .filter((item: Product | Pack) => item
        .status === 'success' && 'product' in item && item.product.code < 999);

    const packs = flattenedResponse
      .filter((item: Product | Pack) => item
        .status === 'success' && 'pack' in item && item.pack.code > 999);

    const errors = flattenedResponse
      .filter((item: Product | Pack) => item.status === 'error');

    return { items: [...products, ...packs], errors };
  };

  async function handleValidation() {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3003/readcsv', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (typeof data === 'object' && 'message' in data) {
        setMistake([data.message]);
      }
      const { items, errors } = processResponse(data);
      setValidatedProducts(items);
      setMistake(errors.map((errorItem) => {
        if ('error' in errorItem) {
          return errorItem.error as string;
        }
        return `Status: ${errorItem.status}, `;
      }));
      setIsLoading(true);
      setIsValid(true);
    } catch (error) {
      console.error('Erro ao validar o arquivo:', error);
    }
  }
  async function handleUpdate() {
    if (!file) return; // Certifique-se de que o arquivo está disponível

    const formData = new FormData();
    formData.append('file', file); // Adicione o arquivo ao formData

    try {
      const response = await fetch('http://localhost:3003/updatecsv', {
        method: 'PUT',
        body: formData, // Use formData para enviar o arquivo
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar os produtos');
      }

      const data = await response.json();

      // Verifica se a resposta é de sucesso
      if (data.status === 'SUCCESS') {
        // Limpa os erros e atualiza a mensagem de sucesso
        setMistake([]);
        setIsValid(true);
        // Aqui você pode adicionar uma lógica para atualizar a UI com a mensagem de sucesso
        // Por exemplo, mostrar um modal ou uma notificação
        setUpdateMessage(data.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        // Caso contrário, trata-se como um erro
        throw new Error(data.data.message || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao atualizar os produtos:', error);
      // Atualiza o estado com a mensagem de erro
      setMistake([(error as { message: string }).message]);
    }
  }
  function renderContent() {
    if (isLoading) {
      return <div className={ styles.loading }>Carregando...</div>;
    }
    if (updateMessage) {
      return <div className={ styles.message }>{updateMessage}</div>;
    }
    return <Tabela products={ validatedProducts } errors={ mistake } />;
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
      {renderContent()}
      <button
        className={ mistake?.some((miss: string) => miss)
          || !isValid ? styles.buttonDisabled : styles.button }
        disabled={ !isValid }
        onClick={ handleUpdate }
      >
        Atualizar Produtos
      </button>
    </main>
  );
}
