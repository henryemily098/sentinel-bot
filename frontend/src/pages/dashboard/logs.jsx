import {
    useEffect,
    useState
} from "react";
import {
    Avatar,
    ButtonGroup,
    Card,
    Container,
    DataList,
    IconButton,
    Link,
    Pagination,
    Stack
} from "@chakra-ui/react";
import {
    BsChevronLeft,
    BsChevronRight,
} from "react-icons/bs";

const pageSize = 5;
function Logs({ client, guild, isSubscribed, session }) {
    let [page, setPage] = useState(1);
    let [logs, setLogs] = useState([]);

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
                destination: `/socket-request/${session}/violations/${guild.id}`
            });
            configSub = client.subscribe(`/socket-response/${session}/violations/${guild.id}`, (response) => {
                let cfg = JSON.parse(response.body);
                setLogs(cfg.filter(violation => violation.user != null));
            });
            updateSub = client.subscribe(`/socket-response/logs/${guild.id}`, (response) => {
                let cfg = JSON.parse(response.body);
                setLogs(items => [cfg, ...items]);
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

    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize
    const visibleViolations = logs.slice(startRange, endRange)
    
    return (
        <Container
            my={3}
        >
            <Stack
                direction="column"
                gapY={3}
            >
                <Card.Root>
                    <Card.Body>
                        <Card.Title>
                            History Logs
                        </Card.Title>
                        <Card.Description>
                            Berisikan riwayat pelanggaran yang terjadi pada server ini. Kamu hanya dapat melihat 100 pelanggaran terbaru.
                        </Card.Description>
                    </Card.Body>
                </Card.Root>

                <Card.Root>
                    <Card.Body
                        gapY={3}
                    >
                        <Stack
                            direction="column"
                            gapY={3}
                        >
                            {
                                visibleViolations.map((violation, index) =>
                                    <Card.Root
                                        key={index}
                                        variant="subtle"
                                    >
                                        <Card.Body>
                                            <Stack
                                                align="center"
                                                direction="row"
                                                gapX={5}
                                            >
                                                <Avatar.Root
                                                    size="xl"
                                                >
                                                    <Avatar.Fallback name={violation.user.globalName || violation.user.username} />
                                                    <Avatar.Image
                                                        src={violation.user.displayAvatarURL + "?size=1024"}
                                                    />
                                                </Avatar.Root>
                                                <Stack
                                                    direction={["column", "column", "row", "row"]}
                                                    gapX={[0, 0, 5, 5]}
                                                >
                                                    <DataList.Root
                                                        orientation="horizontal"
                                                    >
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>
                                                                Username
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                {violation.user.username}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>
                                                                ID
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                {violation.userId}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>
                                                                Date
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                {new Date(violation.timestamp).toLocaleString()}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                    </DataList.Root>
                                                    <DataList.Root
                                                        orientation="horizontal"
                                                    >
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>
                                                                Level
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                {violation.level}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>
                                                                Reason
                                                            </DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                {violation.reason}
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                        <DataList.Item>
                                                            <DataList.ItemLabel>Location</DataList.ItemLabel>
                                                            <DataList.ItemValue>
                                                                <Link
                                                                    colorPalette="blue"
                                                                    href={`https://discord.com/channels/${violation.guildId}/${violation.channelId}/${violation.messageId}`}
                                                                    target="_blank"
                                                                >
                                                                    Click Here
                                                                </Link>
                                                            </DataList.ItemValue>
                                                        </DataList.Item>
                                                    </DataList.Root>
                                                </Stack>
                                            </Stack>
                                        </Card.Body>
                                    </Card.Root>
                                )
                            }
                        </Stack>
                        <Pagination.Root
                            count={logs.length}
                            defaultPage={1}
                            onPageChange={(e) => setPage(e.page)}
                            page={page}
                            pageSize={pageSize}
                        >
                            <ButtonGroup variant="ghost" size="sm">
                                <Pagination.PrevTrigger asChild>
                                    <IconButton>
                                        <BsChevronLeft />
                                    </IconButton>
                                </Pagination.PrevTrigger>

                                <Pagination.Items
                                    render={(page) => (
                                        <IconButton variant={{ base: "ghost", _selected: "outline" }}>
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
                    </Card.Body>
                </Card.Root>
            </Stack>
        </Container>
    );
}

export default Logs;