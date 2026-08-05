import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore"
import type { Product } from "@/types/typeProduct"

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"

export interface TransactionItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Transaction {
  id?: string
  userId: string
  userEmail: string
  items: TransactionItem[]
  totalAmount: number
  deliveryMethod: "courier" | "pickup"
  paymentMethod: "card" | "transfer" | "cod"
  status: TransactionStatus
  createdAt: Timestamp
}

const TRANSACTIONS_COLLECTION = "transactions"

/**
 * Create a new transaction in Firestore.
 */
export async function createTransaction(
  userId: string,
  userEmail: string,
  cartItems: Product[],
  deliveryMethod: "courier" | "pickup",
  paymentMethod: "card" | "transfer" | "cod",
  totalAmount: number,
): Promise<string> {
  const items: TransactionItem[] = cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity ?? 1,
    image: item.image,
  }))

  const transaction: Omit<Transaction, "id"> = {
    userId,
    userEmail,
    items,
    totalAmount,
    deliveryMethod,
    paymentMethod,
    status: "pending",
    createdAt: Timestamp.now(),
  }

  const docRef = await addDoc(
    collection(db, TRANSACTIONS_COLLECTION),
    transaction,
  )
  return docRef.id
}

/**
 * Fetch all transactions for a specific user.
 * Sorted client-side to avoid requiring a Firestore composite index
 * (where userId + orderBy createdAt).
 */
export async function getUserTransactions(
  userId: string,
): Promise<Transaction[]> {
  const q = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where("userId", "==", userId),
  )
  const snapshot = await getDocs(q)
  const transactions = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Transaction,
  )

  return transactions.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0
    const bTime = b.createdAt?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

/**
 * Fetch all transactions for admin panel.
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  const snapshot = await getDocs(collection(db, TRANSACTIONS_COLLECTION))
  const transactions = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Transaction,
  )

  return transactions.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0
    const bTime = b.createdAt?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

/**
 * Update status of a specific transaction in Firestore.
 */
export async function updateTransactionStatus(
  transactionId: string,
  newStatus: TransactionStatus,
): Promise<void> {
  const docRef = doc(db, TRANSACTIONS_COLLECTION, transactionId)
  await updateDoc(docRef, { status: newStatus })
}

/**
 * Human-readable status labels (Polish).
 */
export const transactionStatusLabels: Record<TransactionStatus, string> = {
  pending: "Oczekuje na potwierdzenie",
  confirmed: "Potwierdzone",
  shipped: "W dostawie",
  delivered: "Dostarczone",
  cancelled: "Anulowane",
}

export const transactionStatusColors: Record<TransactionStatus, string> = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
}
