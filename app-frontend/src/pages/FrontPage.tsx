import { MainContent } from './Components/Body/MainContent';
import { Header } from './Components/Header/Header';
import styles from './frontPage.module.css';

function FrontPage() {
  return (
    <div className={ styles.box }>
      <Header />
      <MainContent />

    </div>
  );
}

export default FrontPage;
