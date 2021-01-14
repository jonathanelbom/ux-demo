import Head from 'next/head';
import Prompt from '../components/Prompt/Prompt';
import styles from './App.module.scss';
import data from '../data.json';

export default function Home() {
  return (
    <main className={styles.App}>
      <Head>
        <title>Jonathan Elbom: UX Demo</title>
      </Head>
      <Prompt items={data.data}/>
    </main>
  )
}
