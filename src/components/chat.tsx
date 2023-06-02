import React, { KeyboardEvent, useEffect, useState } from 'react';
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
  Icon
} from '@chakra-ui/react';
import _ from 'lodash';
import { IoSend } from 'react-icons/io5';
import * as prompts from '../utils/anthropic'

interface Message {
  type: string;
  text: string;
}

const MessageDisplay = (message: Message) => {
  return (
    <Flex maxW="80%" flexDir={"column"} justifyContent={"center"}
      backgroundColor={message.type === 'user' ? 'blue.500' : 'gray.500'}
      alignSelf={message.type === 'user' ? 'flex-end' : 'flex-start'}
      minWidth={"20%"}
      padding={2}
      borderRadius={10}
      marginBottom={2}
    >
      <Avatar name={message.type} src={message.type === 'user' ? "" : ""} />
      <Text dangerouslySetInnerHTML={{__html: message.text}}/>
    </Flex>
  );
}

export const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'a i', text: 'Hello, how can I assist you?' }
  ]);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleInput = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const text = inputValue;
      if (text.trim() === '') return;

      setInputValue('')
      const data = [...messages, { type: 'user', text }]
      setMessages(data)
      // Add AI response here
      const airesp = await prompts.getAnthropicPrompt(`${text}/n/nFormat the reponse in HTML`)
        .then(res => res)
        .catch(err => {
          console.log(err)
          return "Sorry, I don't understand"
        });
      setMessages([...data, { type: 'a i', text: airesp }])
    } catch (e) {
      console.log(e);
    }
  };

  

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
  }, [])



  return (
    <React.Fragment>
      <Text>Chat</Text>
    <Flex flexDir="column"
      maxW="80%"
      margin="auto"
      ref={containerRef}
    >
      <Flex width={"80%"} flexDir="column" margin="auto"
      >
        {messages.map((message: any, index: number) => (
          <MessageDisplay key={index} {...message} />
        ))}
      </Flex>
      <InputGroup width="80%" margin="auto">
        {/* <Input type="text" placeholder="Enter your message" value={inputValue} onChange={handleInput} /> */}
        <Textarea placeholder="Enter your message" value={inputValue} onChange={handleInput} resize={"none"}
          ref={inputRef}
        />
        <InputRightElement 
          transform={"translateY(-50%)"}
          top={"50%"}
          children={<Icon as={IoSend} boxSize={6} onClick={handleSubmit} color={"blue"} cursor="pointer" />}
        />
      </InputGroup>
    </Flex>
    </React.Fragment>
  );
};
