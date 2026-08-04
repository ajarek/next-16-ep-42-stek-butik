import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import type { Product, Steak } from "@/types/typeProduct";

const STEAKS_COLLECTION = "steaks";

function toProduct(data: Record<string, unknown>, id: string): Product {
  return {
    id,
    name: (data.title ?? data.name ?? "Stek") as string,
    image: (data.img ?? data.image ?? "/data/img/ribeye.jpg") as string,
    description: (data.desc ?? data.description ?? "") as string,
    price: Number(data.priceNumber ?? data.price ?? 0),
    category: (data.tag ?? data.category ?? "STEAK") as string,
    weight: (data.weight ?? "") as string,
  };
}

function toSteak(data: Record<string, unknown>, id: string): Steak {
  return {
    id,
    title: (data.title ?? data.name ?? "Stek") as string,
    price: String(data.priceNumber ?? data.price ?? "0"),
    img: (data.img ?? data.image ?? "") as string,
    tag: (data.tag ?? data.category ?? "") as string,
    desc: (data.desc ?? data.description ?? "") as string,
    weight: (data.weight ?? "") as string,
    grade: data.grade as string | undefined,
    detail_images: data.detail_images as string[] | undefined,
    movie: data.movie as string | undefined,
    lineage: data.lineage as string | undefined,
    marbling: data.marbling as string | undefined,
  };
}

/**
 * Fetch all products from the "steaks" collection, mapped to the
 * display shape used by the shop (product list, cart).
 */
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, STEAKS_COLLECTION));
  const products = snapshot.docs.map((docSnap) =>
    toProduct(docSnap.data() as Record<string, unknown>, docSnap.id)
  );
  return products.sort(
    (a, b) => Number(a.id) - Number(b.id) || a.name.localeCompare(b.name)
  );
}

/**
 * Fetch all steaks from the "steaks" collection (full schema,
 * used by the admin panel and product detail page).
 */
export async function getSteaks(): Promise<Steak[]> {
  const snapshot = await getDocs(collection(db, STEAKS_COLLECTION));
  return snapshot.docs
    .map((docSnap) =>
      toSteak(docSnap.data() as Record<string, unknown>, docSnap.id)
    )
    .sort(
      (a, b) => Number(a.id) - Number(b.id) || a.title.localeCompare(b.title)
    );
}

/**
 * Fetch a single steak by ID (full schema).
 */
export async function getSteakById(id: string): Promise<Steak | null> {
  const docRef = doc(db, STEAKS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return toSteak(docSnap.data() as Record<string, unknown>, docSnap.id);
}

/**
 * Add a new product to the "steaks" collection.
 */
export async function addProduct(
  product: Record<string, any>
): Promise<string> {
  // Build the document — only include optional fields when they have a value
  const payload: Record<string, any> = {
    title: product.name,
    price: String(product.price),
    priceNumber: product.price,
    img: product.image,
    desc: product.description,
    weight: product.weight,
    createdAt: Timestamp.now(),
  };

  if (product.tag)           payload.tag           = product.tag;
  if (product.grade)         payload.grade         = product.grade;
  if (product.lineage)       payload.lineage       = product.lineage;
  if (product.marbling)      payload.marbling      = product.marbling;
  if (product.movie)         payload.movie         = product.movie;
  if (product.detail_images) payload.detail_images = product.detail_images;

  const docRef = await addDoc(collection(db, STEAKS_COLLECTION), payload);
  return docRef.id;
}

/**
 * Update an existing product in the "steaks" collection (admin only).
 */
export async function updateProduct(
  id: string,
  product: Record<string, any>
): Promise<void> {
  const docRef = doc(db, STEAKS_COLLECTION, id);

  const payload: Record<string, any> = {};

  if (product.name       !== undefined) { payload.title       = product.name; }
  if (product.price      !== undefined) { payload.price       = String(product.price); payload.priceNumber = product.price; }
  if (product.image      !== undefined) { payload.img         = product.image; }
  if (product.description!== undefined) { payload.desc        = product.description; }
  if (product.weight     !== undefined) { payload.weight      = product.weight; }
  if (product.tag        !== undefined) { payload.tag         = product.tag; }
  if (product.grade      !== undefined) { payload.grade       = product.grade; }
  if (product.lineage    !== undefined) { payload.lineage     = product.lineage; }
  if (product.marbling   !== undefined) { payload.marbling    = product.marbling; }
  if (product.movie      !== undefined) { payload.movie       = product.movie; }
  if (product.detail_images !== undefined) { payload.detail_images = product.detail_images; }

  await updateDoc(docRef, payload);
}

/**
 * Delete a product from the "steaks" collection (admin only).
 */
export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, STEAKS_COLLECTION, id);
  await deleteDoc(docRef);
}
