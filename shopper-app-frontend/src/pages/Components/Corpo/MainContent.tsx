import { Tabela } from './Tabela';
import styles from './mainContent.module.css';

export function MainContent() {
  return (
    <main>
      <div>
        <input type="file" placeholder="Envie seu arquivo" className={ styles.input } />
        <button className={ styles.button }>Validar Arquivo</button>
      </div>
      <Tabela />
      <button className={ styles.button }>Atualizar</button>
    </main>
  );
}
