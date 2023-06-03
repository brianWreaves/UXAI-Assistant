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
  const [loadingText, setLoadingText] = useState<string>("Loading ...");

  const [history, updateHistory] = useState<string>("");

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setInputValue(e.target.value);
  };

  /**
   * Local handler for the submit button
   */
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
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
      setLoading(false);
      setCurrentText(airesp)
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [inputValue, messages]);

  const write = useWriter(currentText);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handler = (e: any) => {
      if (e.key === "Enter" && !e.shiftKey) {
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

  /**
   * Auto scroll to bottom when new message is added
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (autoScroll) container.scrollTop = container.scrollHeight;
  }, [write, autoScroll, messages])

  /**
   * Disable auto scroll when user scrolls up
   * and enable it when user scrolls to bottom
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = () => {
      setAutoScroll(container.scrollTop + container.clientHeight === container.scrollHeight)
    }

    container.addEventListener("scroll", handler)

    return () => {
      container.removeEventListener("scroll", handler)
    }
  }, [])

  /**
   * Update loading text
   */
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((text) => {
          if (text === "Loading ...") return "Loading"
          else if (text === "Loading") return "Loading ."
          else if (text === "Loading .") return "Loading .."
          else return "Loading ..."
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [loading])



  return (
    <React.Fragment>
      <Box className='chat-container' height="100%" width="100%" maxW="1440px" pos="absolute" >
        <Box className='side-menu' borderRight=".5px solid" minW="250px" pl="1rem" pr="1rem">
          <Button variant="ghost" colorScheme="blue" size="lg" margin=""
            width="90%" cursor={"pointer"}
            onClick={() => { }}>
            + New Chat
          </Button>
          <Box width={"100%"} height={"80%"} overflow={"auto"} mt=".5rem" >
            <ChatRoom title='Welcome'></ChatRoom>
            <ChatRoom title='What is AGI'></ChatRoom>
            <ChatRoom title='What is fission'></ChatRoom>
          </Box>
        </Box>
        <Box maxWidth="1000px" margin="auto" pos="relative"  width="100%" height="100%" className='chat-window'
          right={0} left={0} top={0} bottom={0}
        >
          <Box
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
              {loading && <MessageDisplay type="a i" text={loadingText} />}
            </Flex>

          </Box>
          <Box pos="absolute" bottom="10px" width="100%" >
            <InputGroup width="90%" margin="auto" bottom="10px" left="0" right="0"
              boxShadow={"0px 0px 10px 0px rgba(0,0,0,0.75)"}
              borderRadius={"20px"}
            >
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

/**
 * Local hook to give the illusion of typing
 * @param text Text to be typed
 * @returns typed text
 */
export const useWriter = (text: string) => {
  const [value, setValue] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!done && index < text.length) {
        setValue(text.substring(0, index + 1));
        setIndex((prev) => prev + 1);
      }

    }, 20);

    return () => clearTimeout(timeout);
  }, [index, done, text]);

  useEffect(() => {
    if (value === text && !done) {
      setIndex(0);
      setDone(true);
    } else {
      setDone(false);
    }
  }, [value, text, done]);

  return value;
}


export const ChatRoom = ({title}:{title: string}) => {

  return (
    <Text
     cursor={"pointer"}
     p=".5rem 1rem"
     bg="gray.100"
     mb=".25rem"
     noOfLines={1}
     fontWeight="500"
    >{title}</Text>
  )
}
