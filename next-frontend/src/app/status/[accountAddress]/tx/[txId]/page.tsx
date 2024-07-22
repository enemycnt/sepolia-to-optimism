"use client";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  Link,
  Heading,
  Step,
  StepDescription,
  StepIndicator,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  StepIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Block, ethers, TransactionResponse } from "ethers";
import {
  etherscanOptimismUrl,
  etherscanSepoliaUrl,
  getMessageSentEvent,
  recieveSenderTxReceipt,
} from "@/lib";
import { Receiver__factory, Sender__factory } from "@/typechain-types";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { MessageEvent } from "@/typechain-types/contracts/Receiver";
import {
  OPTIMISM_RPC_URL,
  RECEIVER_ADDRESS,
  SENDER_ADDRESS,
  SEPOLIA_RPC_URL,
} from "@/lib/constansts";
import { TransactionReceipt } from "ethers";
const steps = [
  { title: "Initial", description: "Transaction has been sent on sepolia" },
  {
    title: "Confirmed on Sepolia",
    description: "Call on L1CrossDomainMessenger has been submitted for relay.",
  },
  {
    title: "Confirmed on Optimism",
    description: "Awaiting call from the Optimism Messenger contract.",
  },
  {
    title: "Finish",
    description: "Receiver contract has handled the call with message",
  },
];
const StatusPage = ({
  params,
}: {
  params: { accountAddress: string; txId: string };
}) => {
  const { accountAddress, txId } = params;
  const [receiverEvent, setReceiverEvent] = useState<
    MessageEvent.Log | undefined
  >();
  const [recievedBlock, setReceivedBlock] = useState<Block | undefined>();
  const [messageSentReceipt, setMessageSentReciept] = useState<
    TransactionReceipt | null | undefined
  >();
  const [recievedTransaction, setReceivedTransaction] = useState<
    TransactionResponse | undefined
  >();
  const [textReceived, setTextReceived] = useState("");
  const [loadingInfo, setLoadingInfo] = useState("");
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    async function fetchStatus() {
      if (accountAddress && txId) {
        const ethProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const senderInstance = Sender__factory.connect(
          SENDER_ADDRESS,
          ethProvider
        );
        setLoadingInfo(
          "Waiting for transaction to be mined on Ethereum Sepolia."
        );
        setActiveStep(1);
        const messageSentReceipt = await recieveSenderTxReceipt(
          txId,
          ethProvider
        );
        const messageSentEvent = await getMessageSentEvent(
          messageSentReceipt!,
          senderInstance
        );
        setMessageSentReciept(messageSentReceipt);
        setActiveStep(2);
        setLoadingInfo(
          "Waiting for a message to be received on Optimism Sepolia."
        );
        const optimismProvider = new ethers.JsonRpcProvider(OPTIMISM_RPC_URL);
        const receiverInstance = Receiver__factory.connect(
          RECEIVER_ADDRESS,
          optimismProvider
        );

        const filter = receiverInstance.filters.Message;
        const rawEvents = await receiverInstance.queryFilter(
          receiverInstance.filters.Message(
            accountAddress,
            undefined,
            messageSentEvent!.nonce
          ),
          -1000
        );

        console.log("raw message event", rawEvents[0]);
        if (rawEvents.length > 0) {
          const rawEvent = rawEvents[0];
          const event = receiverInstance.interface.parseLog(rawEvent);
          setTextReceived(event?.args.toObject().text);
          const block = await optimismProvider.getBlock(rawEvent.blockHash);
          setReceivedBlock(block!);
          const opTx = await optimismProvider.getTransaction(
            rawEvent.transactionHash
          );
          setReceivedTransaction(opTx!);
          setReceiverEvent(rawEvent);
          return;
        }

        receiverInstance.on(filter, async (sender, text, nonce, event) => {
          if (sender === accountAddress && nonce === messageSentEvent!.nonce) {
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
          receiverInstance.removeAllListeners();
        };
      }
    }

    fetchStatus();
  }, [accountAddress, setActiveStep, txId]);



  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="orange.50"
    >
      <Card w="550px">
        <CardHeader>
          <Heading>Status</Heading>
        </CardHeader>
        <CardBody>
          <Stack>
            {receiverEvent ? (
              <Stack>
                <Text fontWeight="bold">
                  Event with message has been received!
                </Text>
                <HStack>
                  <Text>Your message:</Text>
                  <Text>{textReceived}</Text>
                </HStack>
                <HStack>
                  <Text>Sepolia Tx hash:</Text>
                  {messageSentReceipt && (
                    <Link
                      href={etherscanSepoliaUrl(messageSentReceipt.hash)}
                      isExternal
                    >
                      {messageSentReceipt.hash.substring(0, 5)}...
                      {messageSentReceipt.hash.substring(
                        messageSentReceipt.hash.length - 5
                      )}
                      <ExternalLinkIcon mx="2px" mb="5px" />
                    </Link>
                  )}
                </HStack>
                <HStack>
                  <Text>Optimism Tx hash:</Text>
                  {recievedTransaction && (
                    <Link
                      href={etherscanOptimismUrl(recievedTransaction.hash)}
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
              <Stack>
                <Stepper
                  size="lg"
                  colorScheme="green"
                  orientation="vertical"
                  height="250px"
                  gap={0}
                  index={activeStep}
                >
                  {steps.map((step, index) => (
                    <Step key={index}>
                      <StepIndicator>
                        <StepStatus
                          complete={<StepIcon />}
                          active={<Spinner />}
                        />
                      </StepIndicator>

                      <Box flexShrink="0">
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>
                      </Box>

                      <StepSeparator />
                    </Step>
                  ))}
                </Stepper>

                <Text>{loadingInfo}</Text>
              </Stack>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default StatusPage;
