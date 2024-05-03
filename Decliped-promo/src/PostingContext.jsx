// src/PostingContext.js
import { createContext, useContext, useState } from "react";

const PostingContext = createContext();

export function usePosting() {
  return useContext(PostingContext);
}

export function PostingProvider({ children }) {
  const [isPostingEnabled, setPostingEnabled] = useState(false);

  const enablePosting = () => setPostingEnabled(true);
  const disablePosting = () => setPostingEnabled(false);

  return (
    <PostingContext.Provider
      value={{ isPostingEnabled, enablePosting, disablePosting }}
    >
      {children}
    </PostingContext.Provider>
  );
}
