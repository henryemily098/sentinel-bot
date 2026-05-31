import {
    Box,
    Button,
    Container,
    createListCollection,
    Field,
    Flex,
    Input,
    Portal,
    Select,
    Spinner,
    Stack,
    Table,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import {
    useEffect,
    useState
} from "react";
import {
    useNavigate
} from "react-router";

const plans = createListCollection({
    items: [
        {
            label: "1 Month",
            value: "1-month"
        },
        {
            label: "6 Months",
            value: "6-months"
        },
        {
            label: "1 Year",
            value: "1-year"
        }
    ]
});

const paymentMethods = createListCollection({
    items: [
        {
            label: "Gopay",
            value: "gopay"
        },
        {
            label: "DANA",
            value: "dana"
        },
        {
            label: "OVO",
            value: "ovo"
        }
    ]
});

function Subs({ client, guild, user }) {
    const navigate = useNavigate();

    let [loading, setLoading] = useState(false);
    let [plan, setPlan] = useState([]);
    let [paymentMethod, setPaymentMethod] = useState([]);

    useEffect(() => {
        if(!guild) navigate("/server-management");
        else {
            client.onConnect = () => {
                client.subscribe(`/socket-response/subscriptions/${user.id}/add/${guild.id}`, (response) => {
                    let url = response.body;
                    if(url) window.location.href = url;
                    else setLoading(false);
                });
            }
        }
    }, [
        client,
        guild,
        navigate,
        user
    ]);

    const convertTime = (plan) => {
        if(plan === "1-month") return 30 * 24 * 60 * 60 * 1000;
        else if(plan === "6-month") return 6 * convertTime("1-month");
        else if(plan === "1-year") return 12 * convertTime("1-month");
        else return 0;
    }

    const convertPrice = (plan) => {
        if(plan === "1-month") return 100000;
        else if(plan === "6-months") return 6 * convertPrice("1-month");
        else if(plan === "1-year") return 12 * convertPrice("1-month");
        else return 0;
    }

    const submitForm = () => {
        if(plan.length === 0 || paymentMethod.length === 0) return;

        let body = {
            username: user.username,
            email: user.email,
            time: convertTime(plan[0].value),
            paymentMethod: paymentMethod[0]
        }
        setLoading(true);
        client.publish({
            destination: `/socket-request/subscriptions/${user.id}/add/${guild.id}`,
            body: JSON.stringify(body),
            headers: { 'content-type': 'application/json' }
        });
    }

    return (
        guild
        ? (
            <Flex
                align="center"
                direction="column"
                gapY={10}
                justify="center"
                mt={
                    document.getElementById("navbar")
                    ? `${document.getElementById("navbar").clientHeight + 20}px`
                    : 0
                }
            >
                <Container>
                    <Stack
                        align="center"
                        direction={["column", "column", "row", "row"]}
                        justify={["center", "center", "left", "left"]}
                        gapX={5}
                    >
                        <Box
                            bgImg={`url(${guild.iconURL}?size=4096)`}
                            bgPos="center"
                            bgRepeat="no-repeat"
                            bgSize="cover"
                            h={["80px", "80px", "100px", "100px"]}
                            rounded="full"
                            w={["80px", "80px", "100px", "100px"]}
                        >
                        </Box>
                        <Box
                            aria-label="description"
                        >
                            <Box
                                as='h1'
                                fontSize={["sm", "sm", "3xl", "3xl"]}
                                fontWeight="bold"
                                textAlign={["center", "center", "left", "left"]}
                            >
                                BERLANGGANAN UNTUK {guild.name.toLocaleUpperCase()}
                            </Box>
                            <Box
                                as='p'
                                fontSize={["xs", "xs", "xl", "xl"]}
                                textAlign={["center", "center", "left", "left"]}
                            >
                                Dan dapatkan keamanan tambahan berbasis AI yang siap menjaga server anda.
                            </Box>
                        </Box>
                    </Stack>
                </Container>
                <Container>
                    <Wrap
                        gapY={5}
                    >
                        <WrapItem
                            w={["100%", "100%", "48%", "48%"]}
                        >
                            <Field.Root disabled>
                                <Field.Label>Name</Field.Label>
                                <Input type="text" name="username" value={user.username} />
                            </Field.Root>
                        </WrapItem>
                        <WrapItem
                            w={["100%", "100%", "48%", "48%"]}
                        >
                            <Field.Root disabled>
                                <Field.Label>Email</Field.Label>
                                <Input type="email" name="email" value={user.email} />
                            </Field.Root>
                        </WrapItem>
                        <WrapItem
                            w={["100%", "100%", "48%", "48%"]}
                        >
                            <Select.Root
                                collection={plans}
                                onValueChange={(e) => setPlan(e.items)}
                                value={plan.length ? [plan[0].value] : []}
                            >
                                <Select.HiddenSelect />
                                <Select.Label>
                                    Select Plans
                                </Select.Label>
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Plans" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {plans.items.map((plan) => (
                                                <Select.Item item={plan} key={plan.value}>
                                                    {plan.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </WrapItem>
                        <WrapItem
                            w={["100%", "100%", "48%", "48%"]}
                        >
                            <Select.Root
                                collection={paymentMethods}
                                onValueChange={(e) => setPaymentMethod(e.items)}
                                value={paymentMethod.length ? [paymentMethod[0].value] : []}
                            >
                                <Select.HiddenSelect />
                                <Select.Label>
                                    Select Payment Method
                                </Select.Label>
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select Payment Method" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content>
                                            {paymentMethods.items.map((pm) => (
                                                <Select.Item item={pm} key={pm.value}>
                                                    {pm.label}
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        </WrapItem>
                    </Wrap>
                    <Table.Root
                        my={3}
                        variant="outline"
                    >
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Kategori</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="end">Harga</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                plan.length
                                ? (
                                    <Table.Row>
                                        <Table.Cell>
                                            {plan[0].label}
                                        </Table.Cell>
                                        <Table.Cell textAlign="end">
                                            Rp{convertPrice(plan[0].value).toLocaleString("en-US")}
                                        </Table.Cell>
                                    </Table.Row>
                                )
                                : ""
                            }
                            {
                                paymentMethod.length
                                ? (
                                    <Table.Row>
                                        <Table.Cell>
                                            {paymentMethod[0].label}
                                        </Table.Cell>
                                        <Table.Cell textAlign="end">
                                            Rp{
                                                (
                                                    paymentMethod[0].value === "gopay"
                                                    ? 3000
                                                    : paymentMethod[0].value === "dana"
                                                    ? 2000
                                                    : paymentMethod[0].value === "ovo"
                                                    ? 2500
                                                    : 0
                                                ).toLocaleString("en-US")
                                            }
                                        </Table.Cell>
                                    </Table.Row>
                                )
                                : ""
                            }
                        </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.Cell>
                                    Total
                                </Table.Cell>
                                <Table.Cell
                                    textAlign="end"
                                >
                                    Rp{
                                        (
                                            plan.length
                                            ? (
                                                convertPrice(plan[0].value)
                                                + (
                                                    paymentMethod.length
                                                    ? (
                                                        paymentMethod[0].value === "gopay"
                                                        ? 3000
                                                        : paymentMethod[0].value === "dana"
                                                        ? 2000
                                                        : paymentMethod[0].value === "ovo"
                                                        ? 2500
                                                        : 0
                                                    )
                                                    : 0
                                                )
                                            )
                                            : 0
                                        ).toLocaleString("en-US")
                                    }
                                </Table.Cell>
                            </Table.Row>
                        </Table.Footer>
                    </Table.Root>
                    <Stack
                        direction="row"
                        my={5}
                    >
                        <Button
                            colorPalette="blue"
                            disabled={plan.length === 0 || paymentMethod.length === 0}
                            loading={loading}
                            onClick={submitForm}
                        >
                            Subscribe
                        </Button>
                    </Stack>
                </Container>
            </Flex>
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
    )
}

export default Subs;