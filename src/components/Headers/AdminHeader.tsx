import { ActionIcon, Button, Group } from "@mantine/core";

import Link from "next/link";
import Image from "next/image";

import { signIn, signOut, useSession } from "next-auth/react";

import classes from "./styles.module.scss";

import routes from "../../constants/routes";

const AdminHeader = () => {
    const { data: session } = useSession();

    return (
        <header className={`${classes.header} ${classes.teacherHeader}`}>
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
                <Group w={"40%"} gap={50} align="center" justify="flex-end">
                    {session && (
                        <>
                            <ActionIcon p={20} color={"transparent"} component={Link} href={routes.CATEGORIES}>
                                <Image width={36} height={36} src={"/icons/list.svg"} alt="categories-link" />
                            </ActionIcon>
                            <ActionIcon p={20} color={"transparent"} component={Link} href={routes.FAQ_LIST}>
                                <Image width={36} height={36} src={"/icons/faq.svg"} alt="faq-link" />
                            </ActionIcon>
                            <ActionIcon p={20} color={"transparent"} component={Link} href={routes.REQUEST_PROCESSING}>
                                <Image width={36} height={36} src={"/icons/mail.svg"} alt="request-processing-link" />
                            </ActionIcon>
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

export default AdminHeader;
