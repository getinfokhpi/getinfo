import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadFile } from "../api/uploadFile";
import { useSession } from "next-auth/react";
import { RequestStatus } from "../../../constants/request-status";
import { useEffect } from "react";
import { useModalStore } from "@/store/modal.store";
import { Modals } from "@/components/Modals/data/modals";
import useMutationData from "@/hooks/useMutationData";

export interface RequestFormState {
    name: string;
    surname: string;
    email: string;
    studentGroup: string;
    text?: string;
    document?: File;
    directionId: number;
    subDirectionId: number;
}

export default function useCreateForm() {
    const { data: session } = useSession();
    const setOpen = useModalStore((state) => state.setOpen);

    const createRequest = useMutationData({
        url: () => `/api/requests`,
        type: "post",
        queryKeys: { invalidate: [{ queryKey: ["REQUESTS"] }] },
    });

    const form = useForm<RequestFormState>({
        resolver: yupResolver(
            yup.object().shape({
                name: yup.string().required("Обов'язкове поле"),
                surname: yup.string().required("Обов'язкове поле"),
                email: yup.string().email("Недійсна поштова адреса").required("Обов'язкове поле"),
                studentGroup: yup.string().required("Обов'язкове поле"),
                text: yup.string(),
                document: yup.mixed<File>(),
                directionId: yup.number().required("Обов'язкове поле"),
                subDirectionId: yup.number().required("Обов'язкове поле"),
            }),
        ),
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            studentGroup: "",
            text: "",
            document: undefined,
            directionId: undefined,
            subDirectionId: undefined,
        },
    });

    useEffect(() => {
        const [name, surname] = session?.user.name.split(" ") || [];
        form.setValue("name", name || "");
        form.setValue("surname", surname || "");
        form.setValue("email", session?.user.email!);
    }, [session]);

    const onSubmit = async (data: RequestFormState) => {
        try {
            const payload: RequestPayload = {
                name: data.name,
                surname: data.surname,
                email: data.email,
                studentGroup: data.studentGroup,
                userId: session?.user.userId!,
                directionId: data.directionId,
                subDirectionId: data.subDirectionId,
                status: RequestStatus.Submitted,
                text: data.text,
                documentLink: ""
            };

            if (data.document) {
                const response = await uploadFile(data.document);
                payload.documentLink = response.fileLink;
            } 

            createRequest.mutate(payload, {
                onSuccess: () => {
                    setOpen({
                        trigger: Modals.SUCCESS,
                    });
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return {
        form,
        onSubmit,
    };
}
