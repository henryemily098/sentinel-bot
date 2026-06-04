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
    Pagination,
    Stack,
    Text,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    BsArrowLeft,
    BsChevronLeft,
    BsChevronRight,
} from "react-icons/bs";
import {
    useNavigate
} from "react-router";

const pageSize = 9;
function Slots({ client, guilds, remainingSlots, replaceGuild, user, session }) {
    const navigate = useNavigate();

    let [loading, setLoading] = useState("");
    let [query, setQuery] = useState("")
    let [page, setPage] = useState(1);

    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    const visibleGuilds = [...guilds]
        .slice(startRange, endRange)
        .filter(guild => {
            if(!query.length) return true;
            let confirm = true;
            for(let i = 0; i < query.length && confirm; i++) {
                confirm = query[i].toLowerCase() === guild.name[i].toLowerCase();
            }
            return confirm;
        });
    
    useEffect(() => {
        client.onConnect = () => {
            if(replaceGuild) client.subscribe(`/socket-response/${session}/subscriptions/${user.id}/replace/${replaceGuild.id}`, (response) => {
                let url = response.body;
                if(url) window.location.href = url;
            });
        }
    }, [
        client,
        replaceGuild,
        session,
        user
    ]);
    
    const addSlot = (id) => {
        if(!replaceGuild) return;

        setLoading(id);
        client.publish({
            destination: `/socket-request/${session}/subscriptions/${user.id}/replace/${replaceGuild.id}`,
            body: id,
            headers: { 'content-type': 'text/plain' }
        });
    }

    return (
        <Flex
            direction="column"
            mt={
                document.getElementById("navbar")
                ? `${document.getElementById("navbar").clientHeight + 20}px`
                : 0
            }
        >
            <Container>
                <IconButton
                    my={5}
                    onClick={() => navigate("/server-management")}
                    rounded="full"
                    size="xl"
                    variant="outline"
                >
                    <BsArrowLeft />
                </IconButton>
                <Box
                    as="h3"
                >
                    Kamu memiliki
                </Box>
                <Box
                    as="h1"
                    fontSize="2xl"
                    fontWeight="bold"
                >
                    {remainingSlots} slot
                </Box>
                <Box
                    as="h3"
                >
                    kosong untuk diisi dengan server yang kamu punya.
                </Box>
                <Stack
                    direction="row"
                    my={3}
                >
                    <Group
                        attached
                        maxW="sm"
                        w="full"
                    >
                        <Input
                            flex={1}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Server"
                        />
                    </Group>
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
                                                    {guild.approximate_member_count.toLocaleString("en-US")} Anggota <Badge colorPalette="gray">Free</Badge>
                                                </Text>
                                            </Stack>
                                        </Stack>
                                    </Card.Body>
                                    <Card.Footer
                                        flexDirection="column"
                                    >
                                        <Button
                                            colorPalette="teal"
                                            disabled={
                                                remainingSlots === 0
                                                ? (
                                                    loading.length
                                                    ? loading !== guild.id
                                                    : true
                                                )
                                                : false
                                            }
                                            loading={loading.length && loading === guild.id}
                                            onClick={() => addSlot(guild.id)}
                                            w="100%"
                                        >
                                            Add Slot
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
}

export default Slots;