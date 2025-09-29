import { useState, useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

const getTransformStyles = (
    isUp: boolean,
    index: number,
    delay: number,
    enableTransition: boolean
) => ({
    transform: `translateY(${isUp ? "-100%" : "0%"})`,
    transitionProperty: "transform",
    transitionDuration: enableTransition ? "0.5s" : "0s",
    transitionDelay: enableTransition ? `${index * delay}s` : "0s",
});

const splitStringUsingRegex = (inputString: string): string[] => {
    const characters: string[] = [];
    const regex = /[\s\S]/gu;
    let match;
    while ((match = regex.exec(inputString)) !== null) {
        characters.push(match[0]);
    }
    return characters;
};

interface SliderTextProps {
    text?: string;
    transitionDelay?: number;
    [key: string]: any;
}

const SliderText: React.FC<SliderTextProps> = ({
    text = "item",
    transitionDelay = 0.025,
    ...boxProps
}) => {
    const [isUp, setIsUp] = useState(false);
    const [enableTransition, setEnableTransition] = useState(true);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        function animate() {
            // Instantly reset to down (no transition)
            setEnableTransition(false);
            setIsUp(false);

            // After a short delay, animate up (with transition)
            setTimeout(() => {
                setEnableTransition(true);
                setIsUp(true);
            }, 30); // 30ms is enough for browser to apply the reset
        }

        animate(); // Initial animation

        intervalRef.current = setInterval(animate, 6000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <Box
            className="sliderTextContainer"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="fit-content"
            // onMouseEnter={() => setIsUp(true)}
            // onMouseLeave={() => setIsUp(false)}
            {...boxProps}
            _hover={{
                color: "#fff",
                transition: "color 0.5s ease-in-out"
            }}
        >
            <Box position="relative" display="flex" overflow="hidden">
                {splitStringUsingRegex(text).map((character, index) => (
                    <Box key={index} position="relative">
                        <Box
                            as="span"
                            display="inline-block"
                            whiteSpace="pre"
                            style={getTransformStyles(isUp, index, transitionDelay, enableTransition)}
                        >
                            {character}
                        </Box>
                        <Box
                            as="span"
                            display="inline-block"
                            whiteSpace="pre"
                            position="absolute"
                            top="100%"
                            width="100%"
                            left={0}
                            style={getTransformStyles(isUp, index, transitionDelay, enableTransition)}
                        >
                            {character}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default SliderText;
