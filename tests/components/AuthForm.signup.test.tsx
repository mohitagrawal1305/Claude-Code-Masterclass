import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/AuthForm"

vi.mock("@/lib/firebase/config", () => ({ default: {} }))

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn((_db, _collection, id) => ({ id })),
}))

vi.mock("firebase/app", () => ({
  FirebaseError: class FirebaseError extends Error {
    code: string
    constructor(code: string, message: string) {
      super(message)
      this.code = code
      this.name = "FirebaseError"
    }
  },
}))

vi.mock("@/lib/firebase/auth", () => ({ auth: {} }))
vi.mock("@/lib/firebase/firestore", () => ({ db: {} }))

vi.mock("@/lib/generateCodename", () => ({
  generateCodename: vi.fn(() => "SilentCrimsonFerret"),
}))

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}))

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockUid = "test-uid-123"
const mockUser = { uid: mockUid }

beforeEach(() => {
  vi.clearAllMocks()
  mockPush.mockReset()
  ;(useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ push: mockPush })
  ;(createUserWithEmailAndPassword as ReturnType<typeof vi.fn>).mockResolvedValue({
    user: mockUser,
  })
  ;(updateProfile as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
  ;(setDoc as ReturnType<typeof vi.fn>).mockResolvedValue(undefined)
})

async function fillAndSubmit(email = "new@example.com", password = "pass#1") {
  await userEvent.type(screen.getByLabelText("Email"), email)
  await userEvent.type(screen.getByLabelText("Password"), password)
  await userEvent.click(screen.getByRole("button", { name: "Sign Up" }))
}

describe("AuthForm — signup Firebase integration", () => {
  it("calls createUserWithEmailAndPassword with the correct email and password", async () => {
    render(<AuthForm mode="signup" />)
    await fillAndSubmit("new@example.com", "pass#1")
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "new@example.com",
        "pass#1"
      )
    })
  })

  it("calls updateProfile with a non-empty displayName codename", async () => {
    render(<AuthForm mode="signup" />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(mockUser, { displayName: "SilentCrimsonFerret" })
    })
  })

  it("calls setDoc with id and codename but no email field", async () => {
    render(<AuthForm mode="signup" />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { id: mockUid, codename: "SilentCrimsonFerret" }
      )
    })
    const docData = (setDoc as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(docData).not.toHaveProperty("email")
  })

  it("redirects to /heists on success", async () => {
    render(<AuthForm mode="signup" />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("shows inline email error on auth/email-already-in-use", async () => {
    const { FirebaseError } = await import("firebase/app")
    ;(createUserWithEmailAndPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new FirebaseError("auth/email-already-in-use", "Email already in use")
    )
    render(<AuthForm mode="signup" />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(
        screen.getByText("An account with this email already exists.")
      ).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })

  it("shows generic form error on other Firebase errors", async () => {
    const { FirebaseError } = await import("firebase/app")
    ;(createUserWithEmailAndPassword as ReturnType<typeof vi.fn>).mockRejectedValue(
      new FirebaseError("auth/network-request-failed", "Network error")
    )
    render(<AuthForm mode="signup" />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})
