import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"4xl"} fontFamily={"work sans"} color={"black"}>
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        w="100%"
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={"black"}
      >
        <Tabs variant="soft-rounded">
          <TabList marginBottom={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{<Login />}</TabPanel>
            <TabPanel>{<SignUp />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
