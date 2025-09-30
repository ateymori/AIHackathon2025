import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Box, Flex, Text, Input, Button, VStack, HStack, Spacer,
    FormControl, FormLabel, FormErrorMessage, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    useDisclosure, useColorModeValue, Divider,
} from "@chakra-ui/react";

export type ChatUser = { userId: string; name: string; email: string; };
export type ChatMessage = {
    id: string; userId: string; name: string; text: string;
    timestamp: number; pending?: boolean;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const DEFAULT_MAX_MESSAGES = 500;
const MAX_TEXT_LEN = 2000;

const KEYS = { user: "chat:user" } as const;
const memoryStore: Record<string, string | undefined> = {};

function isLocalStorageAvailable(): boolean {
    try {
        if (typeof window === "undefined" || !("localStorage" in window)) return false;
        const k = "__ls_test__"; window.localStorage.setItem(k, "1"); window.localStorage.removeItem(k); return true;
    } catch { return false; }
}
type StorageLike = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; };
function createStorage(): StorageLike {
    if (isLocalStorageAvailable()) {
        return {
            getItem: (k) => window.localStorage.getItem(k),
            setItem: (k, v) => { try { window.localStorage.setItem(k, v); } catch { memoryStore[k] = v; } },
            removeItem: (k) => { window.localStorage.removeItem(k); delete memoryStore[k]; },
        };
    }
    return {
        getItem: (k) => memoryStore[k] ?? null,
        setItem: (k, v) => { memoryStore[k] = v; },
        removeItem: (k) => { delete memoryStore[k]; },
    };
}
function safeParseJSON<T>(raw: string | null): T | null { if (!raw) return null; try { return JSON.parse(raw) as T; } catch { return null; } }
function uuidv4(): string {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
        // @ts-ignore
        const b = crypto.getRandomValues(new Uint8Array(16));
        b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
        const h = (n: number) => n.toString(16).padStart(2, "0");
        return `${h(b[0])}${h(b[1])}${h(b[2])}${h(b[3])}-${h(b[4])}${h(b[5])}-${h(b[6])}${h(b[7])}-${h(b[8])}${h(b[9])}-${h(b[10])}${h(b[11])}${h(b[12])}${h(b[13])}${h(b[14])}${h(b[15])}`;
    }
    const s: string[] = []; const hex = "0123456789abcdef";
    for (let i = 0; i < 36; i++) s[i] = hex[Math.floor(Math.random() * 16)];
    s[14] = "4"; // @ts-ignore
    s[19] = hex[(parseInt(s[19], 16) & 0x3) | 0x8];
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
function formatTime(ts: number): string { try { return new Date(ts).toLocaleString(); } catch { return String(ts); } }
function validateEmailBasic(email: string): boolean { return /.+@.+\..+/.test(email.trim()); }

export interface ChatboxProps { title?: string; maxMessages?: number; height?: string | number; }

const Chatbox: React.FC<ChatboxProps> = ({ title = "Googooli Chat!", maxMessages = DEFAULT_MAX_MESSAGES, height = 420 }) => {
    const storage = useMemo(() => createStorage(), []);
    const [user, setUser] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState(""); const [email, setEmail] = useState("");
    const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({ name: false, email: false });

    const listBg = useColorModeValue("gray.50", "gray.800");
    const myBubbleBg = useColorModeValue("red.50", "red.900");
    const otherBubbleBg = useColorModeValue("gray.200", "gray.700");
    const borderCol = useColorModeValue("gray.200", "gray.700");

    const endRef = useRef<HTMLDivElement | null>(null);
    const seenIdsRef = useRef<Set<string>>(new Set()); // dedupe across fetch + SSE

    const scrollToBottom = useCallback(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, []);

    const setAndTrim = useCallback((updater: (prev: ChatMessage[]) => ChatMessage[]) => {
        setMessages(prev => {
            const next = updater(prev);
            const trimmed = next.slice(Math.max(next.length - maxMessages, 0)).sort((a, b) => a.timestamp - b.timestamp);
            return trimmed;
        });
    }, [maxMessages]);

    const applyIncoming = useCallback((incoming: ChatMessage | ChatMessage[]) => {
        const list = Array.isArray(incoming) ? incoming : [incoming];
        setAndTrim(prev => {
            const seen = new Set(seenIdsRef.current);
            let out = [...prev];
            for (const m of list) {
                if (!m.id) continue;
                // remove optimistic duplicate (same user + same text) if present
                out = out.filter(x => !(x.pending && x.userId === m.userId && x.text === m.text));
                if (!seen.has(m.id)) { out.push({ ...m, pending: false }); seen.add(m.id); }
            }
            seenIdsRef.current = seen;
            return out;
        });
        setTimeout(scrollToBottom, 0);
    }, [scrollToBottom, setAndTrim]);

    // Load identity + history, then connect SSE
    useEffect(() => {
        const storedUser = safeParseJSON<ChatUser>(storage.getItem(KEYS.user));
        if (storedUser && storedUser.userId && storedUser.name && storedUser.email) setUser(storedUser);
        else onOpen();

        // Fetch history (no cache)
        fetch(`${API_BASE}/api/messages`, { cache: "no-store" })
            .then(r => r.json())
            .then((list: ChatMessage[]) => {
                const cleaned = (Array.isArray(list) ? list : []).map(m => ({
                    id: String((m as any).id ?? ""),
                    userId: String((m as any).userId ?? ""),
                    name: String((m as any).name ?? ""),
                    text: String((m as any).text ?? ""),
                    timestamp: Number((m as any).timestamp ?? Date.now()),
                }));
                seenIdsRef.current = new Set(cleaned.map(m => m.id).filter(Boolean));
                setMessages(cleaned.sort((a, b) => a.timestamp - b.timestamp));
                setTimeout(scrollToBottom, 0);
            })
            .catch(() => setMessages([]));

        // SSE realtime
        const es = new EventSource(`${API_BASE}/api/stream`, { withCredentials: false });
        const onMsg = (e: MessageEvent) => {
            try {
                const m = JSON.parse(e.data);
                applyIncoming({
                    id: String(m.id ?? ""),
                    userId: String(m.userId ?? ""),
                    name: String(m.name ?? ""),
                    text: String(m.text ?? ""),
                    timestamp: Number(m.timestamp ?? Date.now()),
                });
            } catch { }
        };
        es.addEventListener("message", onMsg as any);
        es.onmessage = onMsg;
        es.onerror = () => { /* EventSource will auto-retry */ };

        return () => es.close();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applyIncoming]);

    const saveUser = useCallback((u: ChatUser) => {
        setUser(u);
        try { storage.setItem(KEYS.user, JSON.stringify(u)); } catch { }
    }, [storage]);

    const handleSubmitIdentity = () => {
        setTouched({ name: true, email: true });
        const n = name.trim(); const e = email.trim();
        if (!n || !validateEmailBasic(e)) return;
        saveUser({ userId: uuidv4(), name: n, email: e });
        onClose();
    };

    const handleSend = async () => {
        let text = input.trim(); if (!text) return;
        if (text.length > MAX_TEXT_LEN) text = text.slice(0, MAX_TEXT_LEN);
        if (!user) { onOpen(); return; }

        // optimistic bubble
        const tempId = `temp-${uuidv4()}`;
        const optimistic: ChatMessage = { id: tempId, userId: user.userId, name: user.name, text, timestamp: Date.now(), pending: true };
        setAndTrim(prev => [...prev, optimistic]);
        setTimeout(scrollToBottom, 0);
        setInput("");

        try {
            const res = await fetch(`${API_BASE}/api/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.userId, name: user.name, text }),
            });
            if (res.ok) {
                const created = await res.json();
                const real: ChatMessage = {
                    id: String(created.id ?? uuidv4()),
                    userId: String(created.userId ?? user.userId),
                    name: String(created.name ?? user.name),
                    text: String(created.text ?? text),
                    timestamp: Number(created.timestamp ?? Date.now()),
                };
                // Replace optimistic; mark id as seen (prevents SSE double)
                setAndTrim(prev => {
                    const filtered = prev.filter(m => m.id !== tempId);
                    if (!filtered.find(m => m.id === real.id)) filtered.push(real);
                    seenIdsRef.current.add(real.id);
                    return filtered;
                });
            } else {
                // keep optimistic but mark not-pending (e.g., offline)
                setMessages(prev => prev.map(m => m.id === tempId ? { ...m, pending: false } : m));
            }
        } catch {
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, pending: false } : m));
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const nameInvalid = touched.name && !name.trim();
    const emailInvalid = touched.email && !validateEmailBasic(email);
    const myUserId = user?.userId;

    return (
        <Box
            width="100%"
            overflow={"hidden"}
            bg={"#fff"}
            position={"relative"}
            justifyContent={"center"}
            alignItems={"center"}
            display={"flex"}
            padding={"5rem"}
        >
            <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                width={{ base: "90%", lg: "800px" }}
                border={"2px solid black"}
                padding={"1rem"}
                color={"black"}
                bg={"dodgerblue"}
                fontSize={"3rem"}
            >
                <HStack px={4} py={3} borderBottomWidth="1px" borderColor={borderCol}>
                    <Text fontWeight="bold">{title}</Text>
                    <Spacer />
                    {user ? <Text fontSize="sm" color="gray.500">Signed in as <b>{user.name}</b></Text>
                        : <Button size="sm" onClick={onOpen}>Set name & email</Button>}
                </HStack>

                <Box bg={listBg} h={height} overflowY="auto" px={3} py={3}>
                    <VStack align="stretch" spacing={3}>
                        {messages.map(m => {
                            const mine = m.userId === myUserId;
                            return (
                                <Flex key={m.id} justify={mine ? "flex-end" : "flex-start"}>
                                    <Box maxW="80%" bg={mine ? myBubbleBg : otherBubbleBg} borderRadius="xl" px={4} py={2} boxShadow="sm" opacity={m.pending ? 0.7 : 1}>
                                        <HStack spacing={2} align="baseline">
                                            <Text fontWeight="semibold" fontSize="sm">{m.name}</Text>
                                            <Text fontSize="xs" color="gray.500">{formatTime(m.timestamp)}</Text>
                                            {m.pending && <Text fontSize="xs" color="gray.400">sending…</Text>}
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

                <HStack p={3} borderTopWidth="1px" borderColor={borderCol} spacing={2}>
                    <Input placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} autoComplete="off" />
                    <Button colorScheme="red" onClick={handleSend}>Send</Button>
                </HStack>

                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Introduce yourself</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={2}>
                            <FormControl isRequired isInvalid={nameInvalid} mb={3}>
                                <FormLabel>Name</FormLabel>
                                <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(t => ({ ...t, name: true }))} placeholder="Your name" autoFocus />
                                {nameInvalid && <FormErrorMessage>Please enter your name.</FormErrorMessage>}
                            </FormControl>
                            <FormControl isRequired isInvalid={emailInvalid}>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email: true }))} placeholder="you@example.com" />
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
        </Box>
    );
};

export default Chatbox;
