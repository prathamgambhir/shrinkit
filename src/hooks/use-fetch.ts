"use client";

import { useState } from "react";

const useFetch = <TData, TArgs extends unknown[]>(
  cb: (...args: TArgs) => Promise<TData>,
) => {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs): Promise<TData | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
