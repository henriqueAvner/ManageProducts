
# Orientações

## 1. Clone o Repositório

Primeiro, clone o repositório para a sua máquina usando o link gerado aqui.
<br/><br/>
![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/65ae7ccd-ddf1-4f69-ba97-9354c61de864)


## 2. Instale as Dependências


  > :pushpin: Instale as dependências com `npm install`
> - :pushpin: Para rodar o projeto desta forma, obrigatoriamente você deve ter o `node.js` instalado em seu computador da versão 18 para cima.
  
  
  
  <br/>


## 3. Execute o Projeto

```bash
 npm run start
```
- :pushpin: As variáveis de ambiente estão setadas nos arquivos `env-example` e `.env`, se preferir, utilize as próprias com o comando:

     ```bash
    env $(cat .env) npm run start
    ```



## 4. Orientações para o Projeto

### 4.1 Estrutura do Banco de Dados

O banco de dados possui uma tabela de relação N:N entre produtos e packs. A tabela `products` possui as chaves `code`, `name`, `cost_price` e `sales_price`. A tabela `packs` possui `id`, `pack_id`, `product_id` e `qty`.

| products | | packs |
|----------|-|--------|
| code     | | id     |
| name     | | pack_id|
| cost_price | | product_id |
| sales_price | | qty |

Exemplo de dados:

| products | | packs |
|----------|-|--------|
| 25       | | 1      |
| Chocolate| | 1001   |
| 10.00    | | 12     |
| 15.00    | | 3      |


### 4.2 Rotas do Back-end

| Rota    | Método | Descrição                                 |
|---------|--------|--------------------------------------------|
| /readcsv | POST   | Para validar o CSV enviado e avaliar os dados               |
| /updatecsv  | PUT    | Para alterar os valores no banco de dados. |

### 4.3 Fluxo do Front-end

1. Carregar um arquivo .csv.<br/><br/>
![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/10575bb8-83f7-4b38-aa24-d28f8da62428)


3. Ao carregar, o botão de validação de arquivo ficará aberto. Clique em validar.<br/><br/>
![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/d647aa31-e62e-43d7-bde7-4cc8190d99ed)


5. Caso não tenham sido validados, um erro para cada regra quebrada poderá ser lançado na tela, juntamente com os produtos e pacotes que foram validados:<br/><br/>
![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/eaa10afe-9680-4480-9869-32188609ec80)

8. Caso todas as validações estejam corretas, os produtos e os packs correspondentes aparecerão, e o botão para atualizar será liberado.<br/><br/>
   ![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/480c5782-307f-4e4e-a710-3a91fef70759)

10. Ao clicar no botão, o que fora enviado no CSV será alterado no banco de dados, e a página inicial voltará:<br/><br/>
    ![image](https://github.com/henriqueAvner/shopper-test/assets/133919307/d1082809-08c8-40f3-95ec-6c3ac6d66238)





