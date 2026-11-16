import type { Result } from "@/shared/models/result.model"

export const success = <T>(data: T): Result<T> => ({ ok: true, data })

export const failure = <T = never>(error: string): Result<T> => ({ ok: false, error })

export async function guard<T>(call: () => Promise<T>, error: string): Promise<Result<T>> {
  try {
    return success(await call())
  } catch {
    return failure(error)
  }
}
