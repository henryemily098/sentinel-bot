import {
    useEffect,
    useState
} from "react";
import {
    Box,
    Button,
    Card,
    Container,
    Fieldset,
    Stack,
    TagsInput,
    Wrap,
    WrapItem
} from "@chakra-ui/react";

function Badwords({ client, guild, isSubscribed, session }) {
    let [loading, setLoading] = useState(false);
    let [loaded, setLoaded] = useState(false);
    let [words, setWords] = useState([]);

    useEffect(() => {
        let badwordList = null;
        let updateList = null;

        const checkConnection = () => {
            if(!client.connected)
            {
                setTimeout(checkConnection, 2500);
                return;
            }
            client.publish({
                destination: `/socket-request/${session}/badword-list/${guild.id}`
            });
            badwordList = client.subscribe(`/socket-response/${session}/badword-list/${guild.id}`, (response) => {
                let body = JSON.parse(response.body);
                setWords(body.arrayListBadwords);
                setLoaded(true);
            });
            updateList = client.subscribe(`/socket-response/${session}/badword-list/${guild.id}/update`, () => setLoading(false));
        }
        client.onDisconnect = () => checkConnection();
        checkConnection();

        return () => {
            if(badwordList && typeof badwordList.unsubscribe === "function") badwordList.unsubscribe();
            if(updateList && typeof updateList.unsubscribe === "function") updateList.unsubscribe();
        }
    }, [
        client,
        guild,
        session
    ]);

    const saveConfiguration = () => {
        if(!client.connected) return;
        setLoading(true);

        let body = {
            arrayListBadwords: words,
            id: guild.id,
            listBadwords: words.length ? words.join(" ") : null
        }
        client.publish({
            destination: `/socket-request/${session}/badword-list/${guild.id}/update`,
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
                    Banned Kata-Kata
                </Box>
                <Box
                    as="p"
                    fontSize="xl"
                >
                    Tambahkan kata-kata yang dilarang dalam server anda.
                </Box>
            </Box>
            <Card.Root>
                <Card.Body>
                    <Fieldset.Root
                        disabled={!isSubscribed || !loaded || loading}
                    >
                        <Fieldset.Content>
                            <Wrap>
                                <WrapItem
                                    w={["100%", "100%", "48%", "48%"]}
                                >
                                    <TagsInput.Root
                                        addOnPaste
                                        delimiter=" "
                                        onValueChange={(e) => setWords(e.value)}
                                        size="lg"
                                        value={words}
                                    >
                                        <TagsInput.Label>Daftar Kata-Kata Terlarang</TagsInput.Label>
                                        <TagsInput.Control>
                                            <TagsInput.Items />
                                            <TagsInput.Input placeholder="Tambah kata..." />
                                        </TagsInput.Control>
                                    </TagsInput.Root>
                                </WrapItem>
                            </Wrap>
                            <Stack
                                direction="row"
                            >
                                <Button
                                    colorPalette="blue"
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

export default Badwords;