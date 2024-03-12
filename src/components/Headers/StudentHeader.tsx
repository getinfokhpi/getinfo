import { Button, Group } from "@mantine/core";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { signIn, signOut, useSession } from "next-auth/react";

import classes from "./styles.module.scss";
import routes from "../../constants/routes";

const StudentHeader = () => {
    const { data: session } = useSession();
    const path = usePathname();

    return (
        <header className={`${classes.header} ${classes.studentHeader}`}>
            <Group justify="space-between" align="center">
                <Group w={"40%"} px={24} gap={60} align="center">
                    <Link className={classes.link} href="/">
                        Головна
                    </Link>
                    <Link className={classes.link} href="/faq">
                        Часті питання
                    </Link>
                    <Link className={classes.link} href="/about-us">
                        Про нас
                    </Link>
                </Group>
                <Group align="center" justify="center">
                    <Link href={"/"}>
                        <Image width={75} height={34} src="/images/logo.webp" alt="Logo" />
                    </Link>
                </Group>
                <Group w={"40%"} gap={32} align="center" justify="flex-end">
                    {session && (
                        <>
                            {!path.startsWith(routes.REQUEST_PROCESSING) && (
                                <Link className={classes.link} href="/request-processing">
                                    Мої заявки
                                </Link>
                            )}
                            {!path.startsWith(routes.REQUEST_DIRECTIONS) && (
                                <Link className={classes.link} href="/request-directions">
                                    Подати заявку
                                </Link>
                            )}
                        </>
                    )}
                    {session ? (
                        <Button
                            className={classes.button}
                            variant="outline"
                            color={"#fff"}
                            radius="xl"
                            fz={18}
                            fw={600}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Вихід
                        </Button>
                    ) : (
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
                    )}
                </Group>
            </Group>
        </header>
    );
};

export default StudentHeader;
