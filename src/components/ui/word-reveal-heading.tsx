import { motion } from "framer-motion";

/**
 * Splits a heading into words, each masked in its own overflow-hidden box,
 * and slides them up into place with a reverse stagger (last word first) —
 * matches the reference sketch's title treatment.
 */
export function WordRevealHeading({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.15 + (words.length - 1 - i) * 0.09,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
