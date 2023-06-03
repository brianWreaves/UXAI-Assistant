import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Text,
  Textarea,
  Flex,
  Avatar,
  Icon,
  Heading
} from '@chakra-ui/react';
import _ from 'lodash';
import { IoSend } from 'react-icons/io5';
import * as prompts from '../utils/anthropic'


import "./chat.css";

interface Message {
  type: string;
  text: string;
}

const MessageDisplay = (message: Message) => {
  return (
    <Flex maxW="90%" flexDir={"column"} justifyContent={"center"}
      backgroundColor={message.type === 'user' ? 'blue.500' : 'gray.500'}
      alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
      minWidth={"20%"}
      padding={2}
      borderRadius={10}
      marginBottom={2}
    >
      <Avatar name={message.type} src={message.type === 'user' ? "" : ""} />
      <Text dangerouslySetInnerHTML={{ __html: message.text }} />
    </Flex>
  );
}

export const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'a i', text: 'Hello, how can I assist you?' }
  ]);

  const [currentText, setCurrentText] = useState<string>("");

  const [history, updateHistory] = useState<string>("");

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [inputHeight, setInputHeight] = useState(0);

  const handleInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    try {
      const text = inputValue;
      if (text.trim() === '') return;

      setInputValue('')
      const data = currentText.length > 0 ?
        [...messages, { type: 'a i', text: currentText }, { type: 'user', text }] :
        [...messages, { type: 'user', text }]
      setCurrentText("")
      setMessages(data)
      // Add AI response here
      const airesp = await prompts.getAnthropicPrompt(`${text}`)
        .then(res => res)
        .catch(err => {
          console.log(err)
          return "Sorry, I don't understand"
        });
      // setMessages([...data, { type: 'a i', text: airesp }])
      const __html = insertHtmlTags(airesp)
      setCurrentText(__html)
    } catch (e) {
      console.log(e);
    }
  }, [inputValue, messages]);

  const write = textWriter(currentText);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handler = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter key pressed")
        handleSubmit()
      }
    }

    input.addEventListener("keypress", handler)

    return () => {
      input.removeEventListener("keypress", handler)
    }
  }, [handleSubmit])

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [write])

  useEffect(() => {
    if (inputRef.current && inputValue.length > 0) {
      setInputHeight(inputRef.current.scrollHeight);
    }
  }, [inputValue])


  return (
    <React.Fragment>
      <Box className='chat-container' height="100%" width="100%" maxW="1440px" pos="absolute" >
        <Box className='side-menu' borderRight=".5px solid" minW="250px">
          <Button variant="ghost" colorScheme="blue" size="lg" margin=""
            width="90%" cursor={"pointer"}
            onClick={() => { }}>
            + New Chat
          </Button>
        </Box>
        <Box maxWidth="1000px" margin="auto" pos="relative" right="0" width="100%" height="100%" className='chat-window' >
          <Box
            // flexDir="column"
            maxW="95%"
            margin="auto"
            ref={containerRef}
            maxHeight="85%"
            overflow={"auto"}

          >
            <Flex width={"100%"} flexDir="column" margin="auto"
            >
              {messages.map((message: any, index: number) => (
                <MessageDisplay key={index} {...message} />
              ))}
              {currentText !== "" && <MessageDisplay type="a i" text={write} />}
            </Flex>

          </Box>
          <Box pos="absolute" bottom="10px" width="100%" >
            <InputGroup width="90%" margin="auto" bottom="10px" left="0" right="0"
              boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.75)"}
              borderRadius={"20px"}
            >
              {/* <Input type="text" placeholder="Enter your message" value={inputValue} onChange={handleInput} /> */}
              <Textarea placeholder="Enter your message" value={inputValue} onChange={handleInput} resize={"none"}
                ref={inputRef}
                minHeight={"50px"}
                maxHeight={"200px"}
                borderColor={"transparent"}
                borderRadius={"20px"}

                onInput={(e: any) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <InputRightElement
                transform={"translateY(-50%)"}
                top={"50%"}
                children={<Icon as={IoSend} boxSize={6} onClick={handleSubmit} color={"blue"} cursor="pointer" />}
              />
            </InputGroup>
          </Box>
        </Box>
      </Box>
    </React.Fragment >
  );
};

export const textWriter = (text: string) => {
  const [value, setValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // if (isDeleting) {
      //   setValue(text.substring(0, index - 1));
      //   setIndex((prev) => prev - 1);
      // } else {
      setValue(text.substring(0, index + 1));
      setIndex((prev) => prev + 1);
      // }
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, speed, text]);

  // useEffect(() => {
  //   if (index === text.length + 1 && !isDeleting) {
  //     setSpeed(2000);
  //     setIsDeleting(true);
  //   } else if (index === 0 && isDeleting) {
  //     setSpeed(100);
  //     setIsDeleting(false);
  //   }
  // }, [index, isDeleting, text]);

  return value;
}


export const insertHtmlTags = (str: string) => {
  return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
}
