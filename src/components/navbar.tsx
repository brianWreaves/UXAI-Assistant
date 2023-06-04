import { Box, Flex, Text } from '@chakra-ui/react'

const Pages = [
  "Projects",
  "Team",
  "Account",
  "Knowledge Base",
  "Ai Chat",
]
export const Navbar = () => {
  return (
    <Box width="100%" height="50px" borderBottom={".5px solid"} padding={"0 20px"}
      pos="fixed" top="0" left="0" bg="white" zIndex={1}
    >
      <Flex width="100%" height="100%" align={"center"} justify={"space-between"}>
      <Text fontSize={"1.5rem"} fontWeight={"bold"}>UXAI Assistant</Text>
      <Flex flexDir={"row"}
        gap={"1rem"}
        align={"center"}
        height={"100%"}
      >
        {Pages.map((page) => (
          <Flex
            key={page}
            cursor={"pointer"}
            height={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            bg="blue.50"
            width="150px"
            _hover={{
              bg: "blue.100",
              fontWeight: "bold"
            }}
          >{page}</Flex>
        ))}
      </Flex>
      </Flex>
    </Box>
  )
}
