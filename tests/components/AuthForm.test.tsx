import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AuthForm from "@/components/AuthForm"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe("AuthForm — login mode", () => {
  it("renders email field, password field, and submit button", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  it("renders a link to /signup", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute("href", "/signup")
  })
})

describe("AuthForm — signup mode", () => {
  it("renders email field, password field, and submit button", () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
  })

  it("renders a link to /login", () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login")
  })
})

describe("AuthForm — password toggle", () => {
  it("password field starts as type=password", () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("clicking toggle changes type to text", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text")
  })

  it("clicking toggle again reverts to type=password", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.click(screen.getByRole("button", { name: "Show password" }))
    await userEvent.click(screen.getByRole("button", { name: "Hide password" }))
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })
})

describe("AuthForm — validation", () => {
  it("shows email required error on empty submit", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(screen.getByText("Email is required.")).toBeInTheDocument()
  })

  it("shows invalid email error for a malformed email", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.type(screen.getByLabelText("Email"), "notanemail")
    await userEvent.type(screen.getByLabelText("Password"), "hello!")
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument()
  })

  it("shows password length error when password is too short", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
    await userEvent.type(screen.getByLabelText("Password"), "ab!")
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(screen.getByText("Password must be at least 5 characters.")).toBeInTheDocument()
  })

  it("shows special character error when password has no special char", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
    await userEvent.type(screen.getByLabelText("Password"), "abcde")
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(screen.getByText("Password must contain at least 1 special character.")).toBeInTheDocument()
  })
})

describe("AuthForm — submit behaviour", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {})
    vi.clearAllMocks()
  })

  it("calls console.log with email and password on valid login submit", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com")
    await userEvent.type(screen.getByLabelText("Password"), "hello!")
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(console.log).toHaveBeenCalledWith({ email: "test@example.com", password: "hello!" })
  })

  it("calls console.log with email and password on valid signup submit", async () => {
    render(<AuthForm mode="signup" />)
    await userEvent.type(screen.getByLabelText("Email"), "new@example.com")
    await userEvent.type(screen.getByLabelText("Password"), "pass#1")
    await userEvent.click(screen.getByRole("button", { name: "Sign Up" }))
    expect(console.log).toHaveBeenCalledWith({ email: "new@example.com", password: "pass#1" })
  })

  it("does not call console.log when validation fails", async () => {
    render(<AuthForm mode="login" />)
    await userEvent.click(screen.getByRole("button", { name: "Log In" }))
    expect(console.log).not.toHaveBeenCalled()
  })
})
