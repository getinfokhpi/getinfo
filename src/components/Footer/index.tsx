import { FC } from "react";
import styles from "./styles.module.scss";
import Image from "next/image";

import ContainerL from "../Container";
import { Flex, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import routes from "@/constants/routes";

const Footer: FC = () => {
    const router = useRouter();

    return (
        <footer>
            <div className={styles.footer}>
                <div className={styles.footer_line}></div>
                <ContainerL className={styles.footer_container}>
                    <Flex gap={96} justify="center" align="center">
                        <Flex justify="flex-end" gap={48} w="50%">
                            <UnstyledButton onClick={() => router.push("/")} className={styles.link}>
                                Головна
                            </UnstyledButton>
                            <UnstyledButton onClick={() => router.push(routes.REQUEST_PROCESSING)} className={styles.link}>
                                Мої запити
                            </UnstyledButton>
                        </Flex>
                        <Flex>
                            <div className={styles.footer_img}>
                                <Image width={192} height={192} src="/images/khpi-logo.webp" alt="Logo" />
                            </div>
                        </Flex>
                        <Flex gap={48} w="50%">
                            <UnstyledButton onClick={() => router.push(routes.INFORMATION)} className={styles.link}>
                                Питання та відповіді
                            </UnstyledButton>
                            <UnstyledButton onClick={() => router.push(routes.ABOUT_US)} className={styles.link}>
                                Про нас
                            </UnstyledButton>
                        </Flex>
                    </Flex>
                </ContainerL>
            </div>
        </footer>
    );
};

export default Footer;
