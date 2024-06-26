import { useMemo } from "react";
import useCreateForm from "../../hooks/useForm";

import { Stack, Text, Group, Flex, Button, Box } from "@mantine/core";
import { Controller, FormProvider } from "react-hook-form";

import Link from "next/link";
import FormSection from "../FormSections";
import useData from "@/hooks/useData";
import Modal from "@/components/Modals/Modal";
import { Modals } from "@/components/Modals/data/modals";
import { useRouter } from "next/router";
import SuccessModal from "@/components/Modals/SuccessModal";
import TextInput from "@/components/TextInput/TextInput";
import Select from "@/components/Select";
import routes from "@/constants/routes";
import AdditionalInfoModal from "@/components/Modals/AdditionalInfoModal";
import { useModalStore } from "@/store/modal.store";
import Container from "@/components/Container";

const RequestForm = () => {
    const { form, onSubmit } = useCreateForm();
    const setOpen = useModalStore((state) => state.setOpen);
    const router = useRouter();

    const { data } = useData<IGetCategory[]>({
        queryKey: [["CATEGORIES"]],
        path: `/api/directions`,
    });

    const categories = useMemo(() => {
        if (!data) return [];
        return data.map((category) => ({
            group: category.name,
            items: category.subDirections.map((subCategory) => ({ label: subCategory.name, value: subCategory.id?.toString() as string })),
        }));
    }, [data?.length]);

    const directionId = form.watch("directionId");
    const subDirectionId = form.watch("subDirectionId");

    const { additionalInfo, exampleLink } = useMemo(() => {
        const category = data?.find((item) => item.id === directionId);
        const subCategory = category?.subDirections.find((item) => item.id === subDirectionId);

        return {
            additionalInfo: subCategory?.additionalInfo,
            exampleLink: subCategory?.examplelink,
        };
    }, [data, directionId, subDirectionId]);

    return (
        <>
            <Container py={64}>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Stack gap={24}>
                            <Text fz={20} fw={700}>
                                Введіть свої дані{" "}
                                <Text fz={20} fw={700} span c="red">
                                    *
                                </Text>
                            </Text>
                            <Group grow>
                                <Controller
                                    name={"surname"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error && fieldState.error.message}
                                            label="Прізвище"
                                            placeholder="Максилюк"
                                            withAsterisk
                                        />
                                    )}
                                />
                                <Controller
                                    name={"name"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error && fieldState.error.message}
                                            label="Ім’я"
                                            placeholder="Дмитро"
                                            withAsterisk
                                        />
                                    )}
                                />
                            </Group>
                            <Group grow>
                                <Controller
                                    name={"studentGroup"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <TextInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={fieldState.error && fieldState.error.message}
                                            label="Група"
                                            placeholder="ІКМ-220а"
                                            withAsterisk
                                        />
                                    )}
                                />
                                <Box></Box>
                            </Group>
                            <Text fz={20} fw={700}>
                                Введіть корпоративну електронну пошту{" "}
                                <Text fz={20} fw={700} span c="red">
                                    *
                                </Text>
                            </Text>
                            <Controller
                                name={"email"}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <TextInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={fieldState.error && fieldState.error.message}
                                        placeholder="Maksylyuk@infiz.edu.ua"
                                        withAsterisk
                                    />
                                )}
                            />
                            <Text fz={20} fw={700}>
                                Оберіть напрямок запиту{" "}
                                <Text fz={20} fw={700} span c="red">
                                    *
                                </Text>
                            </Text>
                            <Controller
                                name={"subDirectionId"}
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Select
                                        value={field.value ? field.value.toString() : undefined}
                                        onChange={(value) => {
                                            field.onChange(parseInt(value!));
                                            form.setValue(
                                                "directionId",
                                                data?.find((direction) =>
                                                    direction.subDirections.find((subDirection) => subDirection.id === parseInt(value as string)),
                                                )?.id!,
                                            );
                                        }}
                                        error={fieldState.error && fieldState.error.message}
                                        searchable
                                        nothingFoundMessage={"Напрямок не знайдено"}
                                        allowDeselect={false}
                                        label="Прізвище та ім'я екзаменатора"
                                        placeholder="Вибрати зі списку"
                                        data={categories}
                                    />
                                )}
                            />
                            <Group gap={25}>
                                {!!exampleLink && (
                                    <Button
                                        variant="outline"
                                        color={"var(--accent-color)"}
                                        c={"var(--accent-color)"}
                                        style={{ borderWidth: "2px" }}
                                        radius={"xl"}
                                        component={Link}
                                        href={"/"}
                                        target="_blank"
                                    >
                                        Зразок
                                    </Button>
                                )}
                                {!!additionalInfo && (
                                    <Button
                                        variant="outline"
                                        color={"var(--accent-color)"}
                                        c={"var(--accent-color)"}
                                        style={{ borderWidth: "2px" }}
                                        radius={"xl"}
                                        onClick={() =>
                                            setOpen({
                                                trigger: Modals.ADDITIONAL_INFO,
                                                payload: {
                                                    additionalInfo,
                                                },
                                            })
                                        }
                                    >
                                        Інструкція
                                    </Button>
                                )}
                            </Group>
                            <FormSection categories={data!} />
                            <Flex justify="center">
                                <Button type="submit" h={48} w={398} mt={48} radius="xl" color="#02808F">
                                    Подати заявку
                                </Button>
                            </Flex>
                        </Stack>
                    </form>
                </FormProvider>
            </Container>
            <Modal triggers={[Modals.SUCCESS]}>
                <SuccessModal onSuccess={() => router.push(routes.REQUEST_PROCESSING)} text={() => "Ваш запит успішно надіслано"} />
            </Modal>
            <Modal triggers={[Modals.ADDITIONAL_INFO]}>
                <AdditionalInfoModal text={(payload) => payload.additionalInfo} />
            </Modal>
        </>
    );
};

export default RequestForm;
