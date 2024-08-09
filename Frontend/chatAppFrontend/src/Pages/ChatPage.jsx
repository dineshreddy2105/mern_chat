import { ChatState } from "../ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Miscellaneous/SideDrawer"; // Assuming you have this component
import MyChats from "../Miscellaneous/MyChats"; // Assuming you have this component
import ChatBox from "../Miscellaneous/ChatBox"; // Assuming you have this component
import { useState } from "react";
const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
