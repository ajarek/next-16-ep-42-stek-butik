import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { Product } from "@/types/typeProduct";

const PRODUCTS_COLLECTION = "products";

/**
 * Fetch all products from Firestore.
 */
export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

/**
 * Add a new product (for admin/seeding use).
 */
export async function addProduct(
  product: Omit<Product, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

/**
 * Seed the database with initial steak products.
 * Call this once from an admin page or script.
 */
export async function seedProducts(): Promise<void> {
  const steaks: Omit<Product, "id">[] = [
    {
      name: "Porterhouse T-Bone",
      description:
        "Majestatyczny stek łączący polędwicę i rostbef oddzielone kością-T. Intensywny smak, idealne marmurkowatość. Dry-aged 28 dni.",
      price: 149.9,
      image: "/data/img/porterhouse.jpg",
      category: "PREMIUM CUT",
      weight: "600g",
    },
    {
      name: "Antrykot Ribeye",
      description:
        "Najbardziej marmurkowaty stek z żebra. Bogaty w tłuszcz śródmięśniowy, dający niesamowity smak po usmażeniu.",
      price: 129.9,
      image: "/data/img/ribeye.jpg",
      category: "DRY AGED",
      weight: "400g",
    },
    {
      name: "Polędwica Wołowa",
      description:
        "Najdelikatniejsza część wołowiny. Niezrównana miękkość i subtelny smak. Idealna dla koneserów steka.",
      price: 189.9,
      image: "/data/img/filet.jpg",
      category: "TENDERLOIN",
      weight: "300g",
    },
    {
      name: "Rostbef New York Strip",
      description:
        "Klasyczny stek z górnej części polędwicy. Mocny charakter mięsa, wyraźna skórka tłuszczowa i intensywny smak.",
      price: 109.9,
      image: "/data/img/rostbef.jpg",
      category: "CLASSIC",
      weight: "350g",
    },
  ];

  for (const steak of steaks) {
    await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...steak,
      createdAt: Timestamp.now(),
    });
  }
  console.log("✅ Seeded Firestore with steak products.");
}
