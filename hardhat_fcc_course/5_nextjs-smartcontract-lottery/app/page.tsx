import Image from "next/image";
import styles from "./page.module.css";
import { ManualHeader } from "./components/ManualHeader";

export default function Home() {
    return (
        <main className={styles.main}>
            <ManualHeader />
            <div className={styles.description}>Smart contract lottery</div>
        </main>
    );
}
