import { Box } from "@chakra-ui/react";
import { motion } from "motion/react";

const MotionBox = motion.create(Box);

function Reveal({ children, delay = 0, }) {
    return (
        <MotionBox
            initial={{
                opacity: 0,
                y: 50,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            transition={{
                duration: 0.7,
                delay,
            }}
        >
            {children}
        </MotionBox>
    );
}

export default Reveal;