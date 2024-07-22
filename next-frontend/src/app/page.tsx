"use client";
import { useRouter } from "next/navigation";
import { JsonRpcSigner } from "ethers";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import { connectToMetamask, sendMessage } from "../lib";

type Inputs = {
  textMessage: string;
};

const FormPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>();
  const [walletAddress, setWalletAddress] = useState<string | undefined>();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState("");
  const router = useRouter();


  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (signer) {
        setIsMessageSent(true);
        setLoadingInfo("Please confirm transaction on Eth Sepolia");
        const txId = await sendMessage(signer, data.textMessage);
        setLoadingInfo(
          "Waiting for a message to be received on Optimism Sepolia."
        );
        router.push(`/status/${walletAddress}/tx/${txId}`);
      }
    } catch (e) {
      setError("textMessage", {
        type: "manual",
        message: "Error occurs when sending transaction",
      });
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
              {signer && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl isInvalid={!!errors.textMessage}>
                    <FormLabel>Please enter a message to send</FormLabel>
                    <Input
                      autoFocus
                      type="text"
                      disabled={isMessageSent}
                      {...register("textMessage", {
                        required: "This is required",
                        maxLength: 32,
                      })}
                    />
                    <FormErrorMessage>
                      {errors.textMessage && errors.textMessage.message}
                    </FormErrorMessage>
                  </FormControl>
                  <Button
                    mt={4}
                    isLoading={isMessageSent}
                    type="submit"
                    colorScheme="green"
                    variant="solid"
                  >
                    Submit
                  </Button>
                </form>
              )}
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Flex>
  );
};

export default FormPage;
