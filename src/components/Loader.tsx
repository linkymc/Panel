import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingSpinner() {
  function generateNumbers(): number[] {
    const numbers = [];
    for (let i = 0; i <= 365; i += 25) {
      numbers.push(i);
    }
    return numbers;
  }

  return (
    <motion.div
      className="h-24 w-24"
      animate={{
        scale: [1, 1.1, 1.25, 1.3, 1.25, 1.1, 1],
        rotate: generateNumbers(),
      }}
      transition={{
        duration: 0.75,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <Image src="/link.png" width={500} height={500} alt="Link image" />
    </motion.div>
  );
}
