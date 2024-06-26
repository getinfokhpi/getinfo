import { FC } from "react";
import { Box, List, Space, Text } from "@mantine/core";
import CustomDivider from "@/components/CustomDivider/CustomDivider";

const Information: FC = () => {
    return (
        <Box>
            <Text className={"h1_font"} ta="center">
                Інформація
            </Text>
            <CustomDivider mx={"auto"} />
            <Box className={"main_font"} pt={24}>
                <Text span className={"h3_font"}>
                    Quick Direction{" "}
                </Text>
                - це інноваційний сервіс для ефективного та зручного спілкування студентів із дирекцією. Наш сервіс вирішує актуальні проблеми, які
                виникають при дистанційному навчанні та розсіяному місцезнаходженні студентів.
                <Space h="lg" />
                <Text fw={600} inherit>
                    Основні переваги Quick Direction:
                </Text>
                <List type="ordered">
                    <List.Item>
                        Ефективне управління заявками: Ви більше не втратите свої запитання чи заяви в потоці електронних листів. Наш веб-додаток
                        автоматизовано реєструє та направляє кожен запит до відповідного відділу дирекції, гарантуючи його невтратність.
                    </List.Item>
                    <List.Item>
                        Зручне подання запитів: Студенти можуть обрати напрямок свого запитання, заповнити стандартні поля, такі як ПІБ та група, і
                        отримати необхідну інформацію, форми та приклади заповнення заяв – все це в один клік.
                    </List.Item>
                    <List.Item>
                        Індивідуальний ідентифікаційний номер: Кожен запит отримує унікальний ідентифікаційний номер, що спрощує його подальше
                        відстеження та обробку.
                    </List.Item>
                    <List.Item>
                        Ефективне керування обробкою: Запити автоматично розподіляються між методистами, заступниками директора та адміністраторами,
                        які мають відповідну компетенцію. Кожен адміністратор може встановлювати статуси та залишати коментарі, що полегшує взаємодію
                        всієї команди.
                    </List.Item>
                    <List.Item>
                        Легка система листування: Користувачі та адміністратори можуть легко спілкуватися всередині системи, користуючись унікальним
                        ідентифікаційним номером запиту.
                    </List.Item>
                </List>
                <Space h="lg" />З Quick Direction ваше спілкування із дирекцією стає простим та ефективним!
            </Box>
        </Box>
    );
};

export default Information;
