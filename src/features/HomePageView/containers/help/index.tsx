import { FC } from "react";
import styles from "./styles.module.scss";
import CustomButton from "@/components/CustomButton";
import Container from "@/components/Container";
import { useRouter } from "next/router";
import routes from "@/constants/routes";

const HelpSection: FC = () => {
    const router = useRouter();

    const handleEmailClick = () => {
        window.location.href = "mailto:omsroot@kpi.kharkov.ua";
    };

    return (
        <section>
            <Container>
                <div className={styles.help}>
                    <div className={styles.helpCard}>
                        <h3 className={styles.helpCard_title}>Є запитання?</h3>
                        <p className={styles.helpCard_desc}>Ймовірно, що відповідь на ваше запитання уже є в FAQ.</p>
                        <CustomButton className={styles.helpCard_btn} onClick={() => router.push(routes.INFORMATION)}>
                            Перейти до FAQ
                        </CustomButton>
                    </div>
                    <div className={styles.helpCard}>
                        <h3 className={styles.helpCard_title}>Не знайшли відповідь?</h3>
                        <p className={styles.helpCard_desc}>Наша технічна підтримка має відповіді на решту запитань.</p>
                        <CustomButton className={styles.helpCard_btn} onClick={handleEmailClick}>
                            Задати питання
                        </CustomButton>
                    </div>
                    <div className={styles.helpCard}>
                        <h3 className={styles.helpCard_title}>Не маєте запитань?</h3>
                        <p className={styles.helpCard_desc}>Подайте заявку на отримання довідки прямо зараз!</p>
                        <CustomButton className={styles.helpCard_btn} onClick={() => router.push(routes.REQUEST_DIRECTIONS)}>
                            Подати заявку
                        </CustomButton>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HelpSection;
