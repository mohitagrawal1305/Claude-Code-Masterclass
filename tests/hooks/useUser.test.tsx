import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthProvider, useUser } from "@/context/AuthContext"

vi.mock("@/lib/firebase/config", () => ({ default: {} }))

const { mockAuth, mockUnsubscribe, getCapturedCallback, setCapturedCallback } = vi.hoisted(() => {
  const mockAuth: { currentUser: unknown } = { currentUser: null }
  const mockUnsubscribe = vi.fn()
  let capturedCallback: ((user: unknown) => void) | null = null
  return {
    mockAuth,
    mockUnsubscribe,
    getCapturedCallback: () => capturedCallback,
    setCapturedCallback: (cb: ((user: unknown) => void) | null) => {
      capturedCallback = cb
    },
  }
})

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => mockAuth),
  onAuthStateChanged: vi.fn((_auth, callback) => {
    setCapturedCallback(callback)
    return mockUnsubscribe
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  setCapturedCallback(null)
  mockAuth.currentUser = null
})

describe("useUser", () => {
  it("returns loading=true and user=null before onAuthStateChanged fires", () => {
    const { result } = renderHook(() => useUser(), { wrapper: AuthProvider })
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it("returns user and loading=false after callback fires with a user", async () => {
    const mockUser = { uid: "abc123", email: "test@example.com" }
    const { result } = renderHook(() => useUser(), { wrapper: AuthProvider })

    await act(async () => {
      getCapturedCallback()!(mockUser)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual(mockUser)
  })

  it("returns user=null and loading=false after callback fires with null", async () => {
    const { result } = renderHook(() => useUser(), { wrapper: AuthProvider })

    await act(async () => {
      getCapturedCallback()!(null)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it("refetchUser calls reload and resets isUpdating to false after completion", async () => {
    const mockUser = { uid: "abc123", reload: vi.fn().mockResolvedValue(undefined) }
    mockAuth.currentUser = mockUser

    const { result } = renderHook(() => useUser(), { wrapper: AuthProvider })

    await act(async () => {
      getCapturedCallback()!(mockUser)
    })

    await act(async () => {
      await result.current.refetchUser()
    })

    expect(mockUser.reload).toHaveBeenCalledOnce()
    expect(result.current.isUpdating).toBe(false)
  })

  it("throws when useUser is called outside AuthProvider", () => {
    expect(() => renderHook(() => useUser())).toThrow(
      "useUser must be used within an AuthProvider"
    )
  })

  it("updates user when auth state changes from user to null", async () => {
    const mockUser = { uid: "abc123", email: "test@example.com" }
    const { result } = renderHook(() => useUser(), { wrapper: AuthProvider })

    await act(async () => {
      getCapturedCallback()!(mockUser)
    })
    expect(result.current.user).toEqual(mockUser)

    await act(async () => {
      getCapturedCallback()!(null)
    })
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
