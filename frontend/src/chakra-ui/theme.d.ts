import { ChakraTheme } from "@chakra-ui/react";

declare module "@emotion/react" {
  interface Theme extends ChakraTheme {}
}

declare module "@emotion/styled" {
  interface Theme extends ChakraTheme {}
}