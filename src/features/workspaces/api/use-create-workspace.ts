import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string };
type ResponseType = Id<"workspaces"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwError?: boolean;
};

export const useCreateWorkspace = () => {
  const [data, setData] = useState<ResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error" | "settled"
  >("idle");

  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.workspaces.createWorkspace);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        // Reset the state
        setError(null);
        setData(null);
        setStatus("pending");

        const response = await mutation(values);
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setStatus("error");
        setError(error as Error);
        options?.onError?.(error as Error);
        if (options?.throwError) throw error;
      } finally {
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );

  return {
    mutate,
    isPending,
    isError,
    isSuccess,
    error,
    data,
    isSettled,
  };
};
