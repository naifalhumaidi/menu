"use server";
import db from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { coerce, number, string, z } from "zod";
import fs from "fs/promises";
import { PathLike } from "fs";

// Schemas -------------------------------------------------------------------
const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

// Action Schemas -------------------------------------------------------------------
const createSchema = z.object({
  name: string().min(1).max(150),
  priceInCents: coerce.number().int().min(1),
  image: fileSchema.refine((file) => file.size > 0, "Required"),
});

const updateSchema = createSchema.extend({
  image: imageSchema.optional(),
});

// Functions -------------------------------------------------------------------
const createFormDataSchema = (formData: FormData) => {
  return createSchema.safeParse(Object.fromEntries(formData.entries()));
};

const updateFormDataSchema = (formData: FormData) => {
  return updateSchema.safeParse(Object.fromEntries(formData.entries()));
};

const createDirectory = async (dirPath: PathLike) => {
  await fs.mkdir(dirPath, { recursive: true });
};

const getFilePath = (name: string, dirPath: PathLike) => {
  return `${dirPath}/${crypto.randomUUID()}-${name}`;
};

const createFile = async (file: File, dirPath: PathLike) => {
  const filePath = getFilePath(file.name, dirPath);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return filePath;
};

const createImage = async (file: File, dirPath: PathLike) => {
  return (await createFile(file, dirPath)).replace(/public/, "");
};

const deleteFile = async (filePath: string) => {
  await fs.unlink(filePath);
};

const updateFile = async (
  newFile: File,
  dirPath: PathLike,
  oldFilePath: string
) => {
  if (newFile?.size > 0) {
    //? is the performance bad here? i used 2 awaits one by one, or not?, I used the second one after "return"
    await deleteFile(oldFilePath);
    return await createFile(newFile, dirPath);
  }
  return oldFilePath;
};

const updateImage = async (
  newFile: File,
  dirPath: PathLike,
  oldFilePath: string
) => {
  return (await updateFile(newFile, dirPath, `public${oldFilePath}`)).replace(
    /public/,
    ""
  );
};

// Actions -------------------------------------------------------------------
export const createProduct = async (prevState: unknown, formData: FormData) => {
  // getFormData
  const parsedFormData = createFormDataSchema(formData);
  if (parsedFormData.success === false)
    return parsedFormData.error?.formErrors.fieldErrors;
  const data = parsedFormData.data;

  // Make an image and get its path
  await createDirectory("public/products");
  const imagePath = await createImage(data.image, "public/products");

  // Create the product
  await db.product.create({
    data: {
      isAvailable: true,
      name: data.name,
      priceInCents: data.priceInCents,
      imagePath,
    },
  });
  redirect("/admin");
};

export const updateProduct = async (
  id: string,
  prevState: unknown,
  formData: FormData
) => {
  // getFormData
  const parsedFormData = updateFormDataSchema(formData);
  if (!parsedFormData.success)
    return parsedFormData.error?.formErrors.fieldErrors;
  const data = parsedFormData.data;

  // Get the old data
  const prevData = await db.product.findUnique({ where: { id } });
  if (prevData == null) return notFound();

  // Update files
  const imagePath = await updateImage(
    data.image!,
    "public/products",
    prevData?.imagePath
  );

  // Update the database
  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      priceInCents: data.priceInCents,
      imagePath,
    },
  });
  redirect("/admin");
};

export const deleteProduct = async (id: string) => {
  const product = await db.product.delete({
    where: { id },
  });
  if (product == null) return notFound();
    await deleteFile(`public${product.imagePath}`);
};

export const toggleProductAvailability = async (
  id: string,
  isAvailable: boolean
) => {
  await db.product.update({
    where: { id },
    data: { isAvailable: !isAvailable },
  });
};
