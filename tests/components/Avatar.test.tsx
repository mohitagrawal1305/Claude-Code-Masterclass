import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Avatar from "@/components/Avatar"

describe("Avatar", () => {
  it("renders the first letter of a simple name", () => {
    render(<Avatar name="mohit" />)
    expect(screen.getByText("M")).toBeInTheDocument()
  })

  it("renders the first two uppercase letters of a PascalCase name", () => {
    render(<Avatar name="PocketHeist" />)
    expect(screen.getByText("PH")).toBeInTheDocument()
  })

  it("renders with a single uppercase letter when only one capital exists", () => {
    render(<Avatar name="John" />)
    expect(screen.getByText("J")).toBeInTheDocument()
  })
})
