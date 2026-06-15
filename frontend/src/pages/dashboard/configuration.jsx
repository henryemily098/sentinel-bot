import {
    useEffect,
    useState
} from "react";
import {
    Box,
    Button,
    Card,
    Code,
    Container,
    createListCollection,
    Field,
    Fieldset,
    For,
    Input,
    Portal,
    Select,
    Stack,
    Switch,
    Text,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    toaster
} from "../../components/ui/toaster";
import {
    BsFillDiagram3Fill,
    BsPerson,
    BsWindowSidebar
} from "react-icons/bs";
import Action from "./actions";

function Configuration({ channels, client, guild, isSubscribed, session }) {
    let [collection, setCollection] = useState(null);
    let [loading, setLoading] = useState(false);
    let [loaded, setLoaded] = useState(false);

    let [nickname, setNickname] = useState("");
    let [prefix, setPrefix] = useState("");
    let [logChannelId, setLogChannelId] = useState([]);
    let [badwordsEnabled, setBadwordsEnabled] = useState(false);
    let [saGroomingDetected, setSAGroomingDetected] = useState(false);
    let [scammerDetected, setScammerDetected] = useState(false);
    let [phisingLinkDetected, setPhisingLinkDetected] = useState(false);

    useEffect(() => {
        let configSub = null;
        let updateSub = null;

        setCollection(
            createListCollection({
                items: channels
                    .filter(channel => channel.type === 0 || channel.type === 5)
                    .map(i => {
                        return {
                            label: i.name,
                            value: i.id
                        }
                    })
            })
        )
        const checkConnection = () => {
            if(!client.connected)
            {
                setTimeout(checkConnection, 2500);
                return;
            }
            client.publish({
                destination: `/socket-request/${session}/configuration/${guild.id}`
            });
            configSub = client.subscribe(`/socket-response/${session}/configuration/${guild.id}`, (response) => {
                let cfg = JSON.parse(response.body);
                setNickname(cfg.nickname || "");
                setPrefix(cfg.prefix);
                setLogChannelId(cfg.logChannelId ? [cfg.logChannelId] : []);
                setBadwordsEnabled(cfg.badwordsEnabled);
                setSAGroomingDetected(cfg.saGroomingDetected);
                setScammerDetected(cfg.scammerDetected);
                setPhisingLinkDetected(cfg.phisingLinkDetected);
                setLoaded(true);
            });
            updateSub = client.subscribe(`/socket-response/${session}/configuration/${guild.id}/update`, (response) => {
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
        channels,
        client,
        guild,
        session
    ]);

    const saveConfiguration = () => {
        if(!isSubscribed) return;
        if(!client.connected) return;
        setLoading(true);
        
        let body = {
            id: guild.id,
            badwordsEnabled,
            saGroomingDetected,
            scammerDetected,
            phisingLinkDetected,
            logChannelId: logChannelId[0],
            prefix,
            nickname
        }
        client.publish({
            destination: `/socket-request/${session}/configuration/${guild.id}/update`,
            body: JSON.stringify(body),
            headers: { 'content-type': 'application/json' }
        });
    }

    return (
        <Container
            my={3}
        >
            <Box
                as="header"
                my={3}
            >
                <Box
                    as="h1"
                    fontSize="3xl"
                    fontWeight="bold"
                >
                    Konfigurasi Server
                </Box>
                <Box
                    as="p"
                    fontSize="xl"
                >
                    Atur server-mu untuk meningkatkan keamanan-nya.
                </Box>
            </Box>
            <Wrap
                my={3}
            >
                <WrapItem
                    w={["100%", "100%", "32%", "32%"]}
                >
                    <Card.Root
                        w="100%"
                    >
                        <Card.Body>
                            <Stack
                                direction="column"
                                gap={0}
                            >
                                <Box
                                    as="h2"
                                    fontSize="md"
                                    fontWeight="bold"
                                >
                                    <BsPerson />
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    {guild.approximate_member_count.toLocaleString("en-US")}
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="md"
                                >
                                    Anggota
                                </Box>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </WrapItem>
                <WrapItem
                    w={["100%", "100%", "32%", "32%"]}
                >
                    <Card.Root
                        w="100%"
                    >
                        <Card.Body>
                            <Stack
                                direction="column"
                                gap={0}
                            >
                                <Box
                                    as="h2"
                                    fontSize="md"
                                    fontWeight="bold"
                                >
                                    <BsWindowSidebar />
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    {channels.length}
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="md"
                                >
                                    Channel
                                </Box>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </WrapItem>
                <WrapItem
                    w={["100%", "100%", "32%", "32%"]}
                >
                    <Card.Root
                        w="100%"
                    >
                        <Card.Body>
                            <Stack
                                direction="column"
                                gap={0}
                            >
                                <Box
                                    as="h2"
                                    fontSize="md"
                                    fontWeight="bold"
                                >
                                    <BsFillDiagram3Fill />
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    {guild.roles.length}
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="md"
                                >
                                    Roles
                                </Box>
                            </Stack>
                        </Card.Body>
                    </Card.Root>
                </WrapItem>
            </Wrap>
            <Card.Root
                my={3}
            >
                <Card.Body>
                    <Card.Title>
                        Pengaturan Bot
                    </Card.Title>
                    <Card.Description>
                        Atur info basic Sentinel bot pada server anda.
                    </Card.Description>

                    <Fieldset.Root
                        disabled={!isSubscribed || !loaded || loading}
                    >
                        <Fieldset.Content>
                            <Wrap
                                gap={3}
                                my={3}
                            >
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>Nickname</Field.Label>
                                        <Input
                                            max={32}
                                            onChange={(e) => setNickname(e.target.value.substring(0, 32))}
                                            placeholder="Sentinel Bot"
                                            value={nickname}
                                        />
                                        <Field.HelperText>{nickname.length}/32 characters</Field.HelperText>
                                    </Field.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root
                                        required
                                    >
                                        <Field.Label>
                                            Prefix <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input
                                            max={5}
                                            onChange={(e) => setPrefix(e.target.value.substring(0, 5))}
                                            placeholder="!"
                                            value={prefix}
                                        />
                                        <Field.HelperText>{prefix.length}/5 characters</Field.HelperText>
                                    </Field.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Select.Root
                                        collection={collection}
                                        onValueChange={(e) => setLogChannelId(e.value)}
                                        value={logChannelId}
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Label>Select Channel</Select.Label>
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Select channel" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                            <Select.Content>
                                                {collection && collection.items.map((channel) => (
                                                    <Select.Item item={channel} key={channel.value}>
                                                        {channel.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>
                                            Badwords Detected
                                        </Field.Label>
                                        <Switch.Root
                                            checked={badwordsEnabled}
                                            onCheckedChange={(e) => setBadwordsEnabled(e.checked)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                        </Switch.Root>
                                    </Field.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>
                                            Grooming Detection
                                        </Field.Label>
                                        <Switch.Root
                                            checked={saGroomingDetected}
                                            onCheckedChange={(e) => setSAGroomingDetected(e.checked)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                        </Switch.Root>
                                    </Field.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>
                                            Scammer Detection
                                        </Field.Label>
                                        <Switch.Root
                                            checked={scammerDetected}
                                            onCheckedChange={(e) => setScammerDetected(e.checked)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                        </Switch.Root>
                                    </Field.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>
                                            Phising Link Detection
                                        </Field.Label>
                                        <Switch.Root
                                            checked={phisingLinkDetected}
                                            onCheckedChange={(e) => setPhisingLinkDetected(e.checked)}
                                        >
                                            <Switch.HiddenInput />
                                            <Switch.Control>
                                                <Switch.Thumb />
                                            </Switch.Control>
                                        </Switch.Root>
                                    </Field.Root>
                                </WrapItem>
                            </Wrap>
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
            
            <Action
                client={client}
                guild={guild}
                isSubscribed={isSubscribed}
                session={session}
            />

            <Card.Root>
                <Card.Body
                    gapY={3}
                >
                    <Card.Title>
                        Catatan Mengenai Jumlah Pelanggaran
                    </Card.Title>
                    <Stack
                        direction="column"
                        gapX={2}
                    >
                        <For
                            each={[
                                {
                                    colorPalette: "yellow",
                                    label: "Kuning"
                                },
                                {
                                    colorPalette: "orange",
                                    label: "Jingga"
                                },
                                {
                                    colorPalette: "red",
                                    label: "Merah"
                                }
                            ]}
                        >
                            {(item, index) =>
                                <Text
                                    key={index}
                                >
                                    <Code colorPalette={item.colorPalette}>{item.label}</Code> adalah pelanggaran level {index+1}, bobotnya adalah {index+1}.
                                </Text>
                            }
                        </For>
                    </Stack>
                </Card.Body>
            </Card.Root>
        </Container>
    );
}

export default Configuration;