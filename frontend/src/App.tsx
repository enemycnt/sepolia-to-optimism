import { useEffect, useState } from "react";

import "./App.css";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { connectToMetamask, etherscanBalanceUrl, sendMessage } from "./lib";
import { Block, JsonRpcSigner, TransactionResponse, ethers } from "ethers";
import { useForm, SubmitHandler } from "react-hook-form";
import { OPTIMISM_RPC_URL, RECEIVER_ADDRESS } from "./lib/constansts";
import { Receiver__factory } from "./typechain-types";
import { MessageEvent } from "./typechain-types/Receiver";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type Inputs = {
  textMessage: string;
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [receiverEvent, setReceiverEvent] = useState<
    MessageEvent.Log | undefined
  >();
  const [recievedBlock, setReceivedBlock] = useState<Block | undefined>();
  const [recievedTransaction, setReceivedTransaction] = useState<
    TransactionResponse | undefined
  >();
  const [textReceived, setTextReceived] = useState("");

  const [loadingInfo, setLoadingInfo] = useState("");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (signer) {
        setIsMessageSent(true);
        setLoadingInfo("Please confirm transaction on Eth Sepolia");
        await sendMessage(signer, data.textMessage);
        setLoadingInfo(
          "Waiting for a message to be received on Optimism Sepolia."
        );
      }
    } catch (e) {
      setIsMessageSent(false);
    }
  };

  const connect = async () => {
    const signer = await connectToMetamask();
    setSigner(signer);
    const signerAddress = await signer.getAddress();
    setWalletAddress(signerAddress);
  };

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      const provider = new ethers.JsonRpcProvider(OPTIMISM_RPC_URL);
      const contract = Receiver__factory.connect(RECEIVER_ADDRESS, provider);
      const filter = contract.filters.Message;
      contract.on(filter, async (sender, text, event) => {
        if (sender === walletAddress) {
          console.log("Received message: ", text);
          setTextReceived(text);
          const block = await event.getBlock();
          setReceivedBlock(block);
          const opTx = await event.getTransaction();
          setReceivedTransaction(opTx);
          setReceiverEvent(event);
        }
      });

      return () => {
        contract.removeAllListeners();
      };
    }
  }, [walletAddress]);
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="orange.50"
    >
      <Card>
        <CardHeader>
          <Heading>Sepolia to Optimism</Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            <Box>
              {signer ? (
                <Text>Account: {walletAddress}</Text>
              ) : (
                <Button onClick={() => connect()}>Connect</Button>
              )}
            </Box>
            <Box>
              {signer && !isMessageSent && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl isInvalid={!!errors.textMessage}>
                    <FormLabel>Please enter a message to send</FormLabel>
                    <Input
                      autoFocus
                      type="text"
                      {...register("textMessage", {
                        required: "This is required",
                        maxLength: 32,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.textMessage && errors.textMessage.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button mt={4} type="submit">
                    Submit
                  </Button>
                </form>
              )}
            </Box>
            {isMessageSent && (
              <Box>
                <Flex justifyContent="center" mt={4}>
                  {receiverEvent ? (
                    <Stack w="205px">
                      <Text fontWeight="bold">
                        Event with message has been received!
                      </Text>
                      <Text>{textReceived}</Text>
                      <HStack>
                        <Text>Tx hash:</Text>
                        {recievedTransaction && (
                          <Link
                            href={etherscanBalanceUrl(recievedTransaction.hash)}
                            isExternal
                          >
                            {recievedTransaction.hash.substring(0, 5)}...
                            {recievedTransaction.hash.substring(
                              recievedTransaction.hash.length - 5
                            )}
                            <ExternalLinkIcon mx="2px" mb="5px" />
                          </Link>
                        )}
                      </HStack>
                      <HStack>
                        <Text>Block:</Text>
                        <Text>{recievedBlock?.number}</Text>
                      </HStack>
                      <HStack>
                        <Text>Timestamp:</Text>
                        <Text>{recievedBlock?.timestamp} </Text>
                      </HStack>
                    </Stack>
                  ) : (
                    <Stack alignItems="center">
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="xl"
                      />
                      <Text>{loadingInfo}</Text>
                    </Stack>
                  )}
                </Flex>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default App;
