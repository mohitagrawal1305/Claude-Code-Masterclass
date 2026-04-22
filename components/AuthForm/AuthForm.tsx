"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { FirebaseError } from "firebase/app"
import { auth } from "@/lib/firebase/auth"
import { db } from "@/lib/firebase/firestore"
import { generateCodename } from "@/lib/generateCodename"
import styles from "./AuthForm.module.css"

type AuthFormMode = "login" | "signup"

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) errors.email = "Email is required."
  else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email address."
  if (password.length < 5) errors.password = "Password must be at least 5 characters."
  else if (!/[^a-zA-Z0-9]/.test(password)) errors.password = "Password must contain at least 1 special character."
  return errors
}

export default function AuthForm({ mode }: { mode: AuthFormMode }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const router = useRouter()

  const isLogin = mode === "login"
  const title = isLogin ? "Log in to Your Account" : "Signup for an Account"
  const submitLabel = isLogin ? "Log In" : "Sign Up"
  const switchText = isLogin ? "Don't have an account?" : "Already have an account?"
  const switchLabel = isLogin ? "Sign up" : "Log in"
  const switchHref = isLogin ? "/signup" : "/login"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const errs = validate(email, password)
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (mode === "signup") {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const codename = generateCodename()
        await updateProfile(userCredential.user, { displayName: codename })
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            id: userCredential.user.uid,
            codename,
          })
        } catch (firestoreErr) {
          console.error("Firestore write failed:", firestoreErr)
        }
        router.push("/heists")
      } catch (err) {
        if (err instanceof FirebaseError) {
          if (err.code === "auth/email-already-in-use") {
            setErrors({ email: "An account with this email already exists." })
          } else {
            setErrors({ form: "Something went wrong. Please try again." })
          }
        }
      }
    } else {
      // TODO: login
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2 className="form-title">{title}</h2>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.error}>{errors.email}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={styles.toggleBtn}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <span id="password-error" className={styles.error}>{errors.password}</span>
        )}
      </div>

      <button type="submit" className={styles.submitBtn}>{submitLabel}</button>

      {errors.form && (
        <p className={styles.error}>{errors.form}</p>
      )}

      <p className={styles.switchText}>
        {switchText}{" "}
        <Link href={switchHref} className={styles.switchLink}>{switchLabel}</Link>
      </p>
    </form>
  )
}
