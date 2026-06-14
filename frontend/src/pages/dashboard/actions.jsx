import {
    Button,
    ButtonGroup,
    Card,
    createListCollection,
    Field,
    Fieldset,
    IconButton,
    NumberInput,
    Portal,
    Select,
    Stack,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    BsClock,
    BsHammer,
    BsPlus,
    BsTrash,
    BsXOctagon
} from "react-icons/bs"
import {
    useEffect,
    useState
} from "react";
import {
    v4
} from "uuid";
import {
    toaster
} from "../../components/ui/toaster";

const icons = {
    'timeout': <BsClock />,
    'kick': <BsXOctagon />,
    'ban': <BsHammer />
}
const collection = createListCollection({
    items: [
        {
            label: "Timeout",
            value: "timeout"
        },
        {
            label: "Kick",
            value: "kick"
        },
        {
            label: "Ban",
            value: "ban"
        }
    ]
})

function Action({ client, guild, isSubscribed, session }) {
    let [loaded, setLoaded] = useState(false);
    let [loading, setLoading] = useState(false);
    let [actionItems, setActionItems] = useState([]);

    useEffect(() => {
        let configSub = null;
        let updateSub = null;
        const checkConnection = () => {
            if(!client.connected)
            {
                setTimeout(checkConnection, 2500);
                return;
            }
            client.publish({
                destination: `/socket-request/${session}/actions/${guild.id}`
            });
            configSub = client.subscribe(`/socket-response/${session}/actions/${guild.id}`, (response) => {
                let data = JSON.parse(response.body);
                setActionItems(data.map(i => {
                    let seconds = Math.floor(i.duration / 1000);
                    return {
                        id: i.id,
                        action: [i.action],
                        duration: {
                            hours: Math.floor(seconds / 3600),
                            minutes: Math.floor((seconds % 3600) / 60),
                            seconds: Math.floor(((seconds % 3600)  % 60) / 60)
                        },
                        requirementCount: i.requirementCount
                    }
                }));
                setLoaded(true);
            });
            updateSub = client.subscribe(`/socket-response/${session}/actions/${guild.id}/update`, (response) => {
                toaster.create({
                    description: "Konfigurasi berhasil disimpan!",
                    type: "success"
                });
                setLoading(false);
            });
        }
        client.onDisconnect = () => checkConnection();
        checkConnection();

        return () => {
            if(configSub && typeof configSub.unsubscribe === "function") configSub.unsubscribe();
            if(updateSub && typeof updateSub.unsubscribe === "function") updateSub.unsubscribe();
        }
    }, [
        client,
        guild,
        session
    ]);

    const convertTimeToMilliseconds = (time, format) => {
        if(format === "s") return (time * 1000);
        else if(format === "m") return (time * 60) * convertTimeToMilliseconds(1, "s");
        else if(format === "h") return (time * 60) * convertTimeToMilliseconds(1, "m");
    }
    const saveConfiguration = () => {
        if(!isSubscribed) return;
        if(!client.connected) return;
        setLoading(true);

        let data = [...actionItems]
            .filter(item => item.action.length > 0)
            .map(item => {
                return {
                    id: item.id,
                    guildId: guild.id,
                    action: item.action[0],
                    duration: convertTimeToMilliseconds(item.duration.hours, "h") + convertTimeToMilliseconds(item.duration.minutes, "m") + convertTimeToMilliseconds(item.duration.seconds, "s"),
                    requirementCount: item.requirementCount
                }
            });

        client.publish({
            destination: `/socket-request/${session}/actions/${guild.id}/update`,
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return (
        <Card.Root
            my={3}
        >
            <Card.Body
                gapY={3}
            >
                <Card.Title>
                    Konfigurasi Aksi Moderasi
                </Card.Title>
                <Card.Description>
                    Atur konfigurasi aksi untuk memudahkan auto action.
                </Card.Description>

                <ButtonGroup>
                    <IconButton
                        colorPalette="green"
                        onClick={() => setActionItems(items =>
                            [
                                ...items,
                                {
                                    id: v4(),
                                    action: [],
                                    duration: {
                                        hours: 0,
                                        minutes: 0,
                                        seconds: 0
                                    },
                                    requirementCount: 0
                                }
                            ]
                        )}
                    >
                        <BsPlus />
                    </IconButton>
                </ButtonGroup>

                <Fieldset.Root
                    disabled={!isSubscribed || !loaded || loading}
                >
                    <Fieldset.Content>
                        <Stack
                            direction="column"
                            gapY={3}
                        >
                            {
                                actionItems.map((action, index) =>
                                    <Wrap
                                        align="flex-end"
                                        direction="row"
                                        key={index}
                                    >
                                        <WrapItem
                                            w={[
                                                "100%",
                                                "100%",
                                                (
                                                    action.action.length
                                                    ? (
                                                        action.action[0] !== "timeout"
                                                        ? "32%"
                                                        : "24%"
                                                    )
                                                    : "32%"
                                                ),
                                                (
                                                    action.action.length
                                                    ? (
                                                        action.action[0] !== "timeout"
                                                        ? "32%"
                                                        : "24%"
                                                    )
                                                    : "32%"
                                                )
                                            ]}
                                        >
                                            <Field.Root>
                                                <Field.Label>Action</Field.Label>
                                                <Select.Root
                                                    collection={collection}
                                                    onValueChange={(e) => setActionItems(items => {
                                                        let newItems = [...items];
                                                        newItems[index].action = e.value;

                                                        if(e.value[0] !== "timeout") {
                                                            newItems[index].duration.hours = 0;
                                                            newItems[index].duration.minutes = 0;
                                                            newItems[index].duration.seconds = 0;
                                                        }

                                                        return newItems;
                                                    })}
                                                    value={action.action}
                                                    w="100%"
                                                >
                                                    <Select.HiddenSelect />
                                                    <Select.Control>
                                                        <Select.Trigger>
                                                            <Select.ValueText placeholder="Select Action" />
                                                        </Select.Trigger>
                                                        <Select.IndicatorGroup>
                                                            <Select.Indicator />
                                                        </Select.IndicatorGroup>
                                                    </Select.Control>
                                                    <Portal>
                                                        <Select.Positioner>
                                                            <Select.Content>
                                                                {
                                                                    collection.items.map(item =>
                                                                        <Select.Item
                                                                            item={item}
                                                                            key={item.value}
                                                                        >
                                                                            {icons[item.value]}
                                                                            {item.label}
                                                                        </Select.Item>
                                                                    )
                                                                }
                                                            </Select.Content>
                                                        </Select.Positioner>
                                                    </Portal>
                                                </Select.Root>
                                            </Field.Root>
                                        </WrapItem>
                                        {
                                            action.action.length
                                            ? (
                                                action.action[0] !== "timeout"
                                                ? ""
                                                : (
                                                    <WrapItem
                                                        w={["100%", "100%", "24%", "24%"]}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            gapX={2}
                                                        >
                                                            <Field.Root>
                                                                <Field.Label>Hours</Field.Label>
                                                                <NumberInput.Root
                                                                    min={0}
                                                                    onValueChange={(e) => setActionItems(items => {
                                                                        let newItems = [...items];
                                                                        newItems[index].duration.hours = e.valueAsNumber;
                                                                        return newItems;
                                                                    })}
                                                                    value={action.duration.hours}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
                                                            </Field.Root>
                                                            <Field.Root>
                                                                <Field.Label>Minutes</Field.Label>
                                                                <NumberInput.Root
                                                                    min={0}
                                                                    onValueChange={(e) => setActionItems(items => {
                                                                        let newItems = [...items];
                                                                        newItems[index].duration.minutes = e.valueAsNumber;
                                                                        return newItems;
                                                                    })}
                                                                    value={action.duration.minutes}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
                                                            </Field.Root>
                                                            <Field.Root>
                                                                <Field.Label>Seconds</Field.Label>
                                                                <NumberInput.Root
                                                                    min={0}
                                                                    onValueChange={(e) => setActionItems(items => {
                                                                        let newItems = [...items];
                                                                        newItems[index].duration.seconds = e.valueAsNumber;
                                                                        return newItems;
                                                                    })}
                                                                    value={action.duration.seconds}
                                                                >
                                                                    <NumberInput.Control />
                                                                    <NumberInput.Input />
                                                                </NumberInput.Root>
                                                            </Field.Root>
                                                        </Stack>
                                                    </WrapItem>
                                                )
                                            )
                                            : ""
                                        }
                                        <WrapItem
                                            w={[
                                                "100%",
                                                "100%",
                                                (
                                                    action.action.length
                                                    ? (
                                                        action.action[0] !== "timeout"
                                                        ? "32%"
                                                        : "24%"
                                                    )
                                                    : "32%"
                                                ),
                                                (
                                                    action.action.length
                                                    ? (
                                                        action.action[0] !== "timeout"
                                                        ? "32%"
                                                        : "24%"
                                                    )
                                                    : "32%"
                                                )
                                            ]}
                                        >
                                            <Field.Root>
                                                <Field.Label>Violation Count</Field.Label>
                                                <NumberInput.Root
                                                    min={1}
                                                    onValueChange={(e) => setActionItems(items => {
                                                        let newItems = [...items];
                                                        newItems[index].requirementCount = e.valueAsNumber;
                                                        return newItems;
                                                    })}
                                                    value={action.requirementCount}
                                                    w="100%"
                                                >
                                                    <NumberInput.Control />
                                                    <NumberInput.Input />
                                                </NumberInput.Root>
                                            </Field.Root>
                                        </WrapItem>
                                        <WrapItem
                                            w={["100%", "100%", "24%", "24%"]}
                                        >
                                            <Stack
                                                direction="row"
                                            >
                                                <IconButton
                                                    colorPalette='red'
                                                    onClick={() => setActionItems(items => {
                                                        let newItems = [...items];
                                                        newItems.splice(index, 1);
                                                        return newItems;
                                                    })}
                                                >
                                                    <BsTrash />
                                                </IconButton>
                                            </Stack>
                                        </WrapItem>
                                    </Wrap>
                                )
                            }
                        </Stack>
                        <Stack
                            direction="row"
                            gap={3}
                        >
                            <Button
                                colorPalette="blue"
                                loading={loading}
                                onClick={saveConfiguration}
                            >
                                Simpan
                            </Button>
                        </Stack>
                    </Fieldset.Content>
                </Fieldset.Root>
            </Card.Body>
        </Card.Root>
    );
}

export default Action;