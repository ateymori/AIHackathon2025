import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  Spacer,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

// ------------------------------
// Types
// ------------------------------
export type ChatUser = {
  userId: string;
  name: string;
  email: string;
};

export type ChatMessage = {
  id: string;
  userId: string;
  name: string;
  text: string;
  timestamp: number; // epoch ms
};

// ------------------------------
// Config
// ------------------------------
// Backend base URL (Express). Override via Vite env if needed.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const DEFAULT_MAX_MESSAGES = 500;
const MAX_TEXT_LEN = 2000;

// ------------------------------
// Storage helpers for identity (localStorage with in-memory fallback)
// ------------------------------
const KEYS = { user: "chat:user" } as const;
const memoryStore: Record<string, string | undefined> = {};

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !("localStorage" in window)) return false;
    const k = "__ls_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

type StorageLike = {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
};

function createStorage(): StorageLike {
  if (isLocalStorageAvailable()) {
    return {
      getItem: (k) => window.localStorage.getItem(k),
      setItem: (k, v) => {
        try { window.localStorage.setItem(k, v); } catch { memoryStore[k] = v; }
      },
      removeItem: (k) => { window.localStorage.removeItem(k); delete memoryStore[k]; },
    };
  }
  return {
    getItem: (k) => (memoryStore[k] ?? null),
    setItem: (k, v) => { memoryStore[k] = v; },
    removeItem: (k) => { delete memoryStore[k]; },
  };
}

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

// ------------------------------
// Utilities
// ------------------------------
function uuidv4(): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    // @ts-ignore older TS lib
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // v4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
    const h = (n: number) => n.toString(16).padStart(2, "0");
    return (
      h(bytes[0]) + h(bytes[1]) + h(bytes[2]) + h(bytes[3]) + "-" +
      h(bytes[4]) + h(bytes[5]) + "-" + h(bytes[6]) + h(bytes[7]) + "-" +
      h(bytes[8]) + h(bytes[9]) + "-" + h(bytes[10]) + h(bytes[11]) + h(bytes[12]) + h(bytes[13]) + h(bytes[14]) + h(bytes[15])
    );
  }
  const s: string[] = [];
  const hex = "0123456789abcdef";
  for (let i = 0; i < 36; i++) s[i] = hex[Math.floor(Math.random() * 16)];
  s[14] = "4";
  // @ts-ignore
  s[19] = hex[(parseInt(s[19], 16) & 0x3) | 0x8];
  s[8] = s[13] = s[18] = s[23] = "-";
  return s.join("");
}

function formatTime(ts: number): string { try { return new Date(ts).toLocaleString(); } catch { return String(ts); } }
function validateEmailBasic(email: string): boolean { return /.+@.+\..+/.test(email.trim()); }

// ------------------------------
// Component
// ------------------------------
export interface ChatboxProps {
  title?: string;
  maxMessages?: number;
  height?: string | number;
}

const Chatbox: React.FC<ChatboxProps> = ({
  title = "Community Chat",
  maxMessages = DEFAULT_MAX_MESSAGES,
  height = 420,
}) => {
  const storage = useMemo(() => createStorage(), []);

  const [user, setUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  // First-time prompt state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({ name: false, email: false });

  const listBg = useColorModeValue("gray.50", "gray.800");
  const myBubbleBg = useColorModeValue("red.50", "red.900");
  const otherBubbleBg = useColorModeValue("gray.200", "gray.700");
  const borderCol = useColorModeValue("gray.200", "gray.700");

  const endRef = useRef<HTMLDivElement | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set()); // prevent duplicates from SSE + initial fetch

  const scrollToBottom = useCallback(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);

  // Merge helper that dedupes and trims
  const appendMessages = useCallback((incoming: ChatMessage[]) => {
    if (!incoming.length) return;
    setMessages((prev) => {
      const seen = new Set(seenIdsRef.current);
      const merged = [...prev];
      for (const m of incoming) {
        if (m.id && !seen.has(m.id)) {
          merged.push(m);
          seen.add(m.id);
        }
      }
      // Trim to last N
      const trimmed = merged.slice(Math.max(merged.length - maxMessages, 0));
      // Sort ASC by time for display
      trimmed.sort((a, b) => a.timestamp - b.timestamp);
      seenIdsRef.current = seen;
      return trimmed;
    });
  }, [maxMessages]);

  // Load identity & bootstrap messages + realtime
  useEffect(() => {
    // Identity
    const storedUser = safeParseJSON<ChatUser>(storage.getItem(KEYS.user));
    if (storedUser && storedUser.userId && storedUser.name && storedUser.email) {
      setUser(storedUser);
    } else {
      onOpen();
    }

    // Initial history fetch
    fetch(`${API_BASE}/api/messages`)
      .then((r) => r.json())
      .then((list: ChatMessage[]) => {
        // ensure numbers + shape
        const cleaned = (Array.isArray(list) ? list : []).map((m) => ({
          id: String((m as any).id ?? ""),
          userId: String((m as any).userId ?? ""),
          name: String((m as any).name ?? ""),
          text: String((m as any).text ?? ""),
          timestamp: Number((m as any).timestamp ?? Date.now()),
        }));
        // fill seen set
        seenIdsRef.current = new Set(cleaned.map((m) => m.id).filter(Boolean));
        // sort ASC
        cleaned.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(cleaned);
        setTimeout(scrollToBottom, 0);
      })
      .catch(() => {
        setMessages([]);
      });

    // SSE realtime
    const es = new EventSource(`${API_BASE}/api/stream`);
    const onSse = (e: MessageEvent) => {
      try {
        const m = JSON.parse(e.data);
        const msg: ChatMessage = {
          id: String(m.id ?? ""),
          userId: String(m.userId ?? ""),
          name: String(m.name ?? ""),
          text: String(m.text ?? ""),
          timestamp: Number(m.timestamp ?? Date.now()),
        };
        appendMessages([msg]);
        setTimeout(scrollToBottom, 0);
      } catch { /* ignore */ }
    };
    // Our server uses a named event: "message"; browsers also dispatch default 'message'
    es.addEventListener("message", onSse as any);
    es.onmessage = onSse;

    es.onerror = () => {
      // network hiccup; the browser will retry automatically
    };

    return () => {
      es.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendMessages]);

  // Persist user identity
  const saveUser = useCallback((u: ChatUser) => {
    setUser(u);
    try { storage.setItem(KEYS.user, JSON.stringify(u)); } catch { /* ignore */ }
  }, [storage]);

  const handleSubmitIdentity = () => {
    setTouched({ name: true, email: true });
    const n = name.trim();
    const e = email.trim();
    if (!n || !validateEmailBasic(e)) return;
    const newUser: ChatUser = { userId: uuidv4(), name: n, email: e };
    saveUser(newUser);
    onClose();
  };

  const handleSend = async () => {
    let text = input.trim();
    if (!text) return;
    if (text.length > MAX_TEXT_LEN) text = text.slice(0, MAX_TEXT_LEN);

    if (!user) { onOpen(); return; }

    setInput("");

    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, name: user.name, text }),
      });
      if (res.ok) {
        const created = await res.json();
        // Avoid duplicate when SSE arrives: rely on seenIds set
        const msg: ChatMessage = {
          id: String(created.id ?? ""),
          userId: String(created.userId ?? user.userId),
          name: String(created.name ?? user.name),
          text: String(created.text ?? text),
          timestamp: Number(created.timestamp ?? Date.now()),
        };
        appendMessages([msg]);
      } else {
        // Optimistic fallback if server rejected; still show locally
        appendMessages([{ id: uuidv4(), userId: user.userId, name: user.name, text, timestamp: Date.now() }]);
      }
    } catch {
      // Offline or network issue — optimistic append
      appendMessages([{ id: uuidv4(), userId: user.userId, name: user.name, text, timestamp: Date.now() }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const nameInvalid = touched.name && !name.trim();
  const emailInvalid = touched.email && !validateEmailBasic(email);
  const myUserId = user?.userId;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" w="full" maxW="800px">
      {/* Header */}
      <HStack px={4} py={3} borderBottomWidth="1px" borderColor={borderCol}>
        <Text fontWeight="bold">{title}</Text>
        <Spacer />
        {user ? (
          <Text fontSize="sm" color="gray.500">Signed in as <b>{user.name}</b></Text>
        ) : (
          <Button size="sm" onClick={onOpen}>Set name & email</Button>
        )}
      </HStack>

      {/* Messages List */}
      <Box bg={listBg} h={height} overflowY="auto" px={3} py={3}>
        <VStack align="stretch" spacing={3}>
          {messages.map((m) => {
            const mine = m.userId === myUserId;
            return (
              <Flex key={m.id} justify={mine ? "flex-end" : "flex-start"}>
                <Box
                  maxW="80%"
                  bg={mine ? myBubbleBg : otherBubbleBg}
                  borderRadius="xl"
                  px={4}
                  py={2}
                  boxShadow="sm"
                >
                  <HStack spacing={2} align="baseline">
                    <Text fontWeight="semibold" fontSize="sm">{m.name}</Text>
                    <Text fontSize="xs" color="gray.500">{formatTime(m.timestamp)}</Text>
                  </HStack>
                  <Divider my={1} opacity={0.2} />
                  <Text whiteSpace="pre-wrap">{m.text}</Text>
                </Box>
              </Flex>
            );
          })}
          <div ref={endRef} />
        </VStack>
      </Box>

      {/* Composer */}
      <HStack p={3} borderTopWidth="1px" borderColor={borderCol} spacing={2}>
        <Input
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <Button colorScheme="red" onClick={handleSend}>Send</Button>
      </HStack>

      {/* First-time identity modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Introduce yourself</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <FormControl isRequired isInvalid={nameInvalid} mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                placeholder="Your name"
                autoFocus
              />
              {nameInvalid && <FormErrorMessage>Please enter your name.</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={emailInvalid}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                placeholder="you@example.com"
              />
              {emailInvalid && <FormErrorMessage>Please enter a valid email.</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleSubmitIdentity} colorScheme="red">Save</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Chatbox;
