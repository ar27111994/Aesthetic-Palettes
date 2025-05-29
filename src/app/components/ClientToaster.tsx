// app/components/ClientToaster.tsx
"use client";

import {
  Toaster as HotToasterInternal, // Alias to avoid name conflicts
  type Toast,
} from "react-hot-toast";
import { NotificationToast } from "@components/NotificationToast"; // Ensure this path is correct relative to your project structure

/**
 * ClientToaster is a wrapper around react-hot-toast's Toaster.
 * This component ensures that the Toaster and its render prop function,
 * which renders NotificationToast, are handled entirely within a Client Component boundary.
 * This approach resolves potential issues with Next.js App Router's Server/Client component
 * interaction when passing functions as children from Server Components.
 */
export function Toaster() {
  return (
    <HotToasterInternal position="top-right">
      {(
        t: Toast, // Explicitly type `t` as `Toast` for clarity
      ) => (
        <NotificationToast
          toast={t}
          // The `as any` for t.data access implies that `data` is not a standard part of the Toast type,
          // or the project hasn't defined an extended Toast type. This is retained from the original code.
          // Consider defining a more specific type for `t` if `data` has a consistent structure.
          type={(t as any).data?.type}
          title={(t as any).data?.title}
          message={(t as any).data?.message}
        />
      )}
    </HotToasterInternal>
  );
}
