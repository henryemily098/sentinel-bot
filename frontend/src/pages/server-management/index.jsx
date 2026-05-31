import {
    useEffect,
    useState
} from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    Container,
    Flex,
    Group,
    IconButton,
    Input,
    Menu,
    Pagination,
    Portal,
    Spinner,
    Stack,
    Text,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    BsArrowClockwise,
    BsCheck2Circle,
    BsChevronLeft,
    BsChevronRight,
    BsCurrencyExchange,
    BsHddStack,
    BsThreeDots,
    BsXCircle
} from "react-icons/bs"
import {
    Helmet
} from "@dr.pogodin/react-helmet";
import {
    useNavigate,
    useParams
} from "react-router";
import {
    createWebSocket
} from "../../api";
import config from "../../config.json";

import Slots from "./slots";
import Subs from "./subs";

function CardManagement({ icon, title, description }) {
    return (
        <WrapItem
            w={["100%", "100%", "24%", "24%"]}
        >
            <Card.Root
                w="100%"
            >
                <Card.Body>
                    <Card.Title>
                        {icon} {title}
                    </Card.Title>
                    <Card.Description>
                        {description}
                    </Card.Description>
                </Card.Body>
            </Card.Root>
        </WrapItem>
    );
}

const pageSize = 9;
function ServerManagement({ guilds, user }) {
    let { subPath, id } = useParams();
    const navigate = useNavigate();

    let [client, setClient] = useState(null);
    let [subsServer, setSubsServer] = useState([]);
    let [remainingSlots, setRemainingSlots] = useState(0);
    let [loading, setLoading] = useState(true);

    let [query, setQuery] = useState("")
    let [filteredType, setFilteredType] = useState(0);
    let [page, setPage] = useState(1);

    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const visibleGuilds = [...guilds]
        .slice(startRange, endRange)
        .filter(guild => {
            if(filteredType === 1 && !subsServer.map(i => i.id).includes(guild.id)) return false;
            if(filteredType === 2 && subsServer.map(i => i.id).includes(guild.id)) return false;
            if(!query.length) return true;
            let confirm = true;
            for(let i = 0; i < query.length && confirm; i++) {
                confirm = query[i].toLowerCase() === guild.name[i].toLowerCase();
            }
            return confirm;
        });

    useEffect(() => {
        let newClient;
        let acceptedPath = ["slots", "non-subs", "subs", "refresh"];
        if(subPath && !acceptedPath.includes(subPath)) navigate("/server-management");
        else {
            if(subPath === "refresh") window.location.href = config.baseURL + "/auth/login/refresh";
            if(!user) window.location.href = `${config.baseURL}/auth/login`;
            else {
                newClient = createWebSocket(config.baseURL + "/web-socket");
                newClient.onConnect = () => {
                    newClient.publish({
                        destination: `/socket-request/subscriptions/${user.id}`
                    });
                    newClient.subscribe(`/socket-response/subscriptions/${user.id}`, (response) =>  {
                        let sServers = JSON.parse(response.body);
                        let count = 0;
                        for (let i = 0; i < sServers.length; i++) {
                            let idx = guilds.map(i => i.id).indexOf(sServers[i].id);
                            if(idx === -1) count++;
                        }

                        setLoading(false);
                        setRemainingSlots(count);
                        setSubsServer(sServers);
                    });
                }
                setClient(newClient);
            }
        }
        return () => {
            if(newClient) newClient.deactivate();
        }
    }, [
        guilds,
        id,
        navigate,
        subPath,
        user
    ]);

    return (
        user && client && !loading
        ? (
            subPath && subPath === "slots"
            ? (
                <Slots
                    client={client}
                    guilds={guilds.filter(guild => !subsServer.map(i => i.id).includes(guild.id))}
                    remainingSlots={remainingSlots}
                    replaceGuild={subsServer[0]}
                    user={user}
                />
            )
            :
            subPath && subPath === "non-subs"
            ? (
                <Subs
                    client={client}
                    guild={(() => {
                        let index = guilds.map(i => i.id).indexOf(id);
                        if(index === -1) return null;

                        let index2 = subsServer.map(i => i.id).indexOf(id);
                        return index2 > -1 ? null : guilds[index];
                    })()}
                    user={user}
                />
            )
            : (
                <Flex
                    align="center"
                    direction="column"
                    justify="center"
                    mt={
                        document.getElementById("navbar")
                        ? `${document.getElementById("navbar").clientHeight}px`
                        : 0
                    }
                >
                    <Helmet>
                        <title>Server Management - Sentinel Bot</title>
                    </Helmet>
                    <Container>
                        <Box
                            as="h1"
                            fontSize="3xl"
                            fontWeight="bold"
                            mt={10}
                        >
                            Server Management
                        </Box>
                        <Box
                            as="p"
                        >
                            Kelola semua server Discord yang menggunakan Sentinel Bot
                        </Box>
                        <Wrap
                            my={2}
                        >
                            <CardManagement
                                description="Total Server"
                                icon={<BsHddStack />}
                                title={guilds.length}
                            />
                            <CardManagement
                                description="Server Berlangganan"
                                icon={<BsCheck2Circle />}
                                title={subsServer.length}
                            />
                            <CardManagement
                                description="Server Non-Berlangganan"
                                icon={<BsXCircle />}
                                title={guilds.length - subsServer.length}
                            />
                            <CardManagement
                                description="Sisa Slot Langganan"
                                icon={<BsCurrencyExchange />}
                                title={remainingSlots}
                            />
                        </Wrap>
                    </Container>
                    <Container>
                        <Stack
                            direction="row"
                            display={["none", "none", "flex", "flex"]}
                            my={3}
                        >
                            <Group
                                attached
                                maxW="sm"
                                w="full"
                            >
                                <IconButton
                                    bg="bg.subtle"
                                    onClick={() => navigate("/server-management/refresh")}
                                    variant="outline"
                                >
                                    <BsArrowClockwise />
                                </IconButton>
                                <Input
                                    flex={1}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search Server"
                                />
                            </Group>
                            <Group
                                attached
                                maxW="sm"
                                w="full"
                            >
                                <Button
                                    bg="bg.subtle"
                                    disabled={filteredType === 0}
                                    onClick={() => setFilteredType(0)}
                                    variant="outline"
                                >
                                    Semua
                                </Button>
                                <Button
                                    bg="bg.subtle"
                                    disabled={filteredType === 1}
                                    onClick={() => setFilteredType(1)}
                                    variant="outline"
                                >
                                    Berlangganan
                                </Button>
                                <Button
                                    bg="bg.subtle"
                                    disabled={filteredType === 2}
                                    onClick={() => setFilteredType(2)}
                                    variant="outline"
                                >
                                    Tidak Berlangganan
                                </Button>
                                <Button
                                    bg="bg.info"
                                    onClick={() => navigate("/server-management/slots")}
                                    variant="outline"
                                >
                                    Isi Slot Kosong
                                </Button>
                            </Group>
                        </Stack>
                        <Stack
                            direction="row"
                            display={["flex", "flex", "none", "none"]}
                            my={3}
                        >
                            <Group
                                attached
                                maxW="sm"
                                w="full"
                            >
                                <IconButton
                                    bg="bg.subtle"
                                    onClick={() => navigate("/server-management/refresh")}
                                    variant="outline"
                                >
                                    <BsArrowClockwise />
                                </IconButton>
                                <Input
                                    flex={1}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search Server"
                                />
                            </Group>
                            <Menu.Root>
                                <Menu.Trigger asChild>
                                    <IconButton
                                        bg="bg.subtle"
                                        variant="outline"
                                    >
                                        <BsThreeDots />
                                    </IconButton>
                                </Menu.Trigger>
                                <Portal>
                                    <Menu.Positioner>
                                        <Menu.Content>
                                            <Menu.RadioItemGroup
                                                onValueChange={(e) => {
                                                    if(e.value === "3") navigate("/server-management/slots");
                                                    else setFilteredType(parseInt(e.value));
                                                }}
                                                value={`${filteredType}`}
                                            >
                                                <Menu.RadioItem
                                                    value="0"
                                                >
                                                    Semua
                                                    <Menu.ItemIndicator />
                                                </Menu.RadioItem>
                                                <Menu.RadioItem
                                                    value="1"
                                                >
                                                    Berlangganan
                                                    <Menu.ItemIndicator />
                                                </Menu.RadioItem>
                                                <Menu.RadioItem
                                                    value="2"
                                                >
                                                    Tidak Berlangganan
                                                    <Menu.ItemIndicator />
                                                </Menu.RadioItem>
                                                <Menu.RadioItem
                                                    value="3"
                                                >
                                                    Isi Slot Kosong
                                                </Menu.RadioItem>
                                            </Menu.RadioItemGroup>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Portal>
                            </Menu.Root>
                        </Stack>
                        <Wrap>
                            {

                                visibleGuilds.map((guild, index) =>
                                    <WrapItem
                                        key={index}
                                        w={["100%", "100%", "32%", "32%"]}
                                    >
                                        <Card.Root
                                            w="100%"
                                        >
                                            <Card.Body>
                                                <Stack
                                                    align="center"
                                                    direction="row"
                                                    gapX={5}
                                                >
                                                    <Avatar.Root
                                                        size="2xl"
                                                    >
                                                        <Avatar.Fallback name={guild.name} />
                                                        <Avatar.Image src={guild.iconURL + "?size=4096"} />
                                                    </Avatar.Root>
                                                    <Stack
                                                        direction="column"
                                                        gap={0}
                                                    >
                                                        <Text
                                                            fontSize="xl"
                                                            fontWeight="bold"
                                                        >
                                                            {guild.name.length > 20 ? `${guild.name.substring(0, 17)}...` : guild.name}
                                                        </Text>
                                                        <Text>
                                                            {guild.approximate_member_count.toLocaleString("en-US")} Anggota <Badge
                                                                colorPalette={
                                                                    subsServer.map(i => i.id).indexOf(guild.id) !== -1
                                                                    ? "blue"
                                                                    : "gray"
                                                                }
                                                            >
                                                                {
                                                                    subsServer.map(i => i.id).indexOf(guild.id) !== -1
                                                                    ? "Premium"
                                                                    : "Free"
                                                                }
                                                             </Badge>
                                                        </Text>
                                                    </Stack>
                                                </Stack>
                                            </Card.Body>
                                            <Card.Footer
                                                flexDirection="column"
                                            >
                                                <Button
                                                    colorPalette={
                                                        subsServer.map(i => i.id).indexOf(guild.id) !== -1
                                                        ? (
                                                            subsServer[subsServer.map(i => i.id).indexOf(guild.id)].joined
                                                            ? "teal"
                                                            : "red"
                                                        )
                                                        : "blue"
                                                    }
                                                    onClick={() => {
                                                        let idx = subsServer.map(i => i.id).indexOf(guild.id);
                                                        if(idx !== -1) {
                                                            if(subsServer[idx].joined) navigate(`/dashboard/${guild.id}`);
                                                            else window.location.href = `${config.baseURL}/auth/login?server_id=${guild.id}&guild=1`;
                                                        }
                                                        else navigate(`/server-management/non-subs/${guild.id}/subs`);
                                                    }}
                                                    w="100%"
                                                >
                                                    {
                                                        subsServer.map(i => i.id).indexOf(guild.id) !== -1
                                                        ? (
                                                            subsServer[subsServer.map(i => i.id).indexOf(guild.id)].joined
                                                            ? "Konfigurasi"
                                                            : "Add Bot"
                                                        )
                                                        : "Subscribe"
                                                    }
                                                </Button>
                                            </Card.Footer>
                                        </Card.Root>
                                    </WrapItem>
                                )
                            }
                        </Wrap>
                        {
                            visibleGuilds.length > 9
                            ? (
                                <Pagination.Root
                                    count={visibleGuilds.length}
                                    my={3}
                                    onPageChange={(p) => setPage(p.page)}
                                    page={page}
                                    pageSize={pageSize}
                                >
                                    <ButtonGroup
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <Pagination.PrevTrigger asChild>
                                            <IconButton>
                                                <BsChevronLeft />
                                            </IconButton>
                                        </Pagination.PrevTrigger>

                                        <Pagination.Items
                                            render={(page) => (
                                                <IconButton
                                                    variant={{ base: "ghost", _selected: "outline" }}
                                                >
                                                    {page.value}
                                                </IconButton>
                                            )}
                                        />

                                        <Pagination.NextTrigger asChild>
                                            <IconButton>
                                                <BsChevronRight />
                                            </IconButton>
                                        </Pagination.NextTrigger>
                                    </ButtonGroup>
                                </Pagination.Root>
                            )
                            : ""
                        }
                    </Container>
                </Flex>
            )
        )
        : (
            <Flex
                align="center"
                h="100vh"
                justify="center"
            >
                <Spinner
                    size="xl"
                />
            </Flex>
        )
    );
}

export default ServerManagement;