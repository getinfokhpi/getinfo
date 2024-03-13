import { Button, Group } from "@mantine/core";

import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";

import classes from "./styles.module.scss";
import routes from "../../constants/routes";

const DefautHeader = () => {
    return (
        <header className={`${classes.header} ${classes.studentHeader}`}>
            <Group justify="space-between" align="center">
                <Group w={"40%"} px={24} gap={60} align="center">
                    <Link className={classes.link} href={routes.MAIN}>
                        Головна
                    </Link>
                    <Link className={classes.link} href={routes.INFORMATION}>
                        Інформація
                    </Link>
                    <Link className={classes.link} href={routes.ABOUT_US}>
                        Про нас
                    </Link>
                </Group>
                <Group align="center" justify="center">
                    <Link href={"/"}>
                        <Image width={75} height={34} src="/images/logo.webp" alt="Logo" />
                    </Link>
                </Group>
                <Group w={"40%"} gap={32} align="center" justify="flex-end">
                    <Button
                        className={classes.button}
                        variant="outline"
                        color={"#fff"}
                        radius="xl"
                        fz={18}
                        fw={600}
                        onClick={() => signIn("keycloak")}
                    >
                        Увійти
                    </Button>
                </Group>
            </Group>
        </header>
    );
};

export default DefautHeader;
