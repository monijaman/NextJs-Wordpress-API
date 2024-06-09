import Image from "next/image";
import styles from "./page.module.scss";
import Herobanner from "@/components/Herobanner.tsx/HeroBanner";
import CtaBlock from "@/components/Ctablock/CtaBlock";
import ImageTextBlock from "@/components/ImageTextBlock/imageTextBlock";
import FormContainer from "@/components/FormContainer/FormContainer";
import ColumnsContainer from "@/components/ColumnsContainer/ColumnsContainer";
import VideoComponent from "@/components/VideoComponent/VideoComponent"; 

export default function Home() {
  return (
    <main className={styles.main}>
       <Herobanner />
       <CtaBlock />
       <VideoComponent thumbnailUrl="ocean-field.png" videoId="LXb3EKWsInQ"   />
       <ColumnsContainer />
       <ImageTextBlock />
       <FormContainer />
    </main>
  );
}
