import { describe, it, expect } from "vitest"
import { generateCodename } from "@/lib/generateCodename"

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy()
    expect(typeof generateCodename()).toBe("string")
  })

  it("is PascalCase (three capitalised words joined)", () => {
    const codename = generateCodename()
    expect(codename).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/)
  })

  it("produces at least 2 distinct results across 10 runs", () => {
    const results = new Set(Array.from({ length: 10 }, () => generateCodename()))
    expect(results.size).toBeGreaterThanOrEqual(2)
  })
})
