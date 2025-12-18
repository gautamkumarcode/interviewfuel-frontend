"use client";
import { useEffect, useState } from "react";

const LandingInput = () => {
  const placeholders = [
    "Search for Javascript interview questions...",
    "Search for React interview questions...",
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    const current = placeholders[placeholderIndex];

    const timeout = setTimeout(() => {
      if (typingForward) {
        if (charIndex < current.length) {
          setCharIndex((prev) => prev + 1);
          setPlaceholder(current.substring(0, charIndex + 1));
        } else {
          setTypingForward(false);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          setPlaceholder(current.substring(0, charIndex - 1));
        } else {
          setTypingForward(true);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, typingForward ? 100 : 50);

    return () => clearTimeout(timeout);
  }, [charIndex, typingForward, placeholderIndex, placeholders]);

  return (
    <form>
      <input
        type="text"
        placeholder={placeholder}
        className="w-[45vw] p-3 border border-gray-400 rounded-lg shadow-md outline-none text-lg"
      />
    </form>
  );
};

export default LandingInput;
