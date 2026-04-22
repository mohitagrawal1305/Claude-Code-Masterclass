import { getFirestore } from "firebase/firestore"
import app from "@/lib/firebase/config"

export const db = getFirestore(app)
