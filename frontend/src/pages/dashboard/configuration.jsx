import {
    useEffect,
    useState
} from "react";
import {
    Box,
    Button,
    Card,
    Combobox,
    Container,
    Field,
    Fieldset,
    Input,
    Portal,
    Slider,
    Stack,
    Switch,
    useFilter,
    useListCollection,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    toaster
} from "../../components/ui/toaster";
import {
    BsFillDiagram3Fill,
    BsFillExclamationTriangleFill,
    BsMegaphone,
    BsPerson,
    BsWindowSidebar
} from "react-icons/bs";
import {
    FaHashtag
} from "react-icons/fa";

const channelIcons = {
    0: <FaHashtag />,
    5: <BsMegaphone />
}

function Configuration({ channels, client, guild, isSubscribed }) {
    let { contains } = useFilter({ sensitivity: "base" });
    let { collection, filter } = useListCollection({
        initialItems: channels.map((channel) => { return { label: channel.name, value: channel.id } }),
        filter: contains
    });
    let [loading, setLoading] = useState(false);
    let [loaded, setLoaded] = useState(true);

    let [nickname, setNickname] = useState("");
    let [prefix, setPrefix] = useState("");
    let [logChannelId, setLogChannelId] = useState([]);
    let [aiSenstivity, setAISensitivity] = useState([1]);
    let [badwordsEnabled, setBadwordsEnabled] = useState(false);
    let [sexualHarassmentDetected, setSexualHarassmentDetected] = useState(false);
    let [groomingDetected, setGroomingDetected] = useState(false);
    let [scammerDetected, setScammerDetected] = useState(false);
    let [onlineGambleDetected, setOnlineGambleDetected] = useState(false);
    let [phisingLinkDetected, setPhisingLinkDetected] = useState(false);

    useEffect(() => {
        const checkConnection = () => {
            if(!client.connected)
            {
                setTimeout(checkConnection, 2500);
                return;
            }
            client.publish({
                destination: `/socket-request/configuration/${guild.id}`
            });
            client.subscribe(`/socket-response/configuration/${guild.id}`, (response) => {
                let cfg = JSON.parse(response.body);
                setNickname(cfg.nickname || "");
                setPrefix(cfg.prefix);
                setLogChannelId(cfg.logChannelId ? [cfg.logChannelId] : []);
                setAISensitivity([cfg.aisentivity]);
                setBadwordsEnabled(cfg.badwordsEnabled);
                setSexualHarassmentDetected(cfg.sexualHarassmentDetected);
                setGroomingDetected(cfg.groomingDetected);
                setScammerDetected(cfg.scammerDetected);
                setOnlineGambleDetected(cfg.onlineGambleDetected);
                setPhisingLinkDetected(cfg.phisingLinkDetected);
                setLoaded(false);
            });
            client.subscribe(`/socket-response/configuration/${guild.id}/update`, (response) => {
                setLoading(false);
                toaster.create({
                    description: "Konfigurasi berhasil disimpan!",
                    type: "success"
                });
            });
        }
        client.onDisconnect = () => checkConnection();
        checkConnection();
    }, [
        client,
        guild
    ]);

    const saveConfiguration = () => {
        if(!client.connected) return;
        setLoading(true);
        
        let body = {
            id: guild.id,
            badwordsEnabled,
            aisentivity: aiSenstivity[0],
            sexualHarassmentDetected,
            groomingDetected,
            scammerDetected,
            onlineGambleDetected,
            phisingLinkDetected,
            logChannelId: logChannelId[0],
            prefix,
            nickname
        }
        client.publish({
            destination: `/socket-request/configuration/${guild.id}/update`,
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
            <Wrap>
                <WrapItem
                    w={["100%", "100%", "24%", "24%"]}
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
                    w={["100%", "100%", "24%", "24%"]}
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
                    w={["100%", "100%", "24%", "24%"]}
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
                <WrapItem
                    w={["100%", "100%", "24%", "24%"]}
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
                                    <BsFillExclamationTriangleFill />
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    0
                                </Box>
                                <Box
                                    as="h2"
                                    fontSize="md"
                                >
                                    Pelanggaran
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
                        disabled={!isSubscribed || loaded || loading}
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
                                    <Combobox.Root
                                        collection={collection}
                                        closeOnSelect
                                        onInputValueChange={(e) => filter(e.inputValue)}
                                        onValueChange={(e) => setLogChannelId(e.value)}
                                        openOnClick
                                        value={logChannelId}
                                    >
                                        <Combobox.Label>
                                            Log Channel
                                        </Combobox.Label>
                                        <Combobox.Control>
                                            <Combobox.Input placeholder="Ketik untuk mencari channel" />
                                            <Combobox.IndicatorGroup>
                                                <Combobox.ClearTrigger />
                                                <Combobox.Trigger />
                                            </Combobox.IndicatorGroup>
                                        </Combobox.Control>
                                        <Portal>
                                            <Combobox.Positioner>
                                                <Combobox.Content>
                                                    <Combobox.Empty>Item tidak ditemukan!</Combobox.Empty>
                                                    {
                                                        channels.filter(ch => ch.type === 0 || ch.type === 5).map(ch =>
                                                            <Combobox.Item item={{ label: ch.name, value: ch.id }} key={ch.id}>
                                                                <Stack
                                                                    align="center"
                                                                    direction="row"
                                                                    gap={2}
                                                                >
                                                                    {channelIcons[ch.type]}
                                                                    <Box as="span">{ch.name}</Box>
                                                                </Stack>
                                                                <Combobox.ItemIndicator />
                                                            </Combobox.Item>
                                                        )
                                                    }
                                                </Combobox.Content>
                                            </Combobox.Positioner>
                                        </Portal>
                                    </Combobox.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Slider.Root
                                        onValueChange={(e) => setAISensitivity(e.value)}
                                        max={10}
                                        min={0}
                                        value={aiSenstivity}
                                        w="100%"
                                    >
                                        <Stack
                                            direction="row"
                                            justify="space-between"
                                        >
                                            <Slider.Label>AI Sensitivity</Slider.Label>
                                            <Slider.ValueText />
                                        </Stack>
                                        <Slider.Control>
                                            <Slider.Track>
                                                <Slider.Range />
                                            </Slider.Track>
                                            <Slider.Thumbs rounded="full" />
                                        </Slider.Control>
                                    </Slider.Root>
                                </WrapItem>
                                <WrapItem
                                    w={["100%", "100%", "48%", "32%"]}
                                >
                                    <Field.Root>
                                        <Field.Label>
                                            Sexual Harrasment Detection
                                        </Field.Label>
                                        <Switch.Root
                                            checked={sexualHarassmentDetected}
                                            onCheckedChange={(e) =>setSexualHarassmentDetected(e.checked)}
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
                                            checked={groomingDetected}
                                            onCheckedChange={(e) => setGroomingDetected(e.checked)}
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
                                            Online Gamble Detection
                                        </Field.Label>
                                        <Switch.Root
                                            checked={onlineGambleDetected}
                                            onCheckedChange={(e) => setOnlineGambleDetected(e.checked)}
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
        </Container>
    );
}

export default Configuration;