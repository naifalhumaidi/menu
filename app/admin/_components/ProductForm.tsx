"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatter";
import { useActionState, useState } from "react";
import { createProduct, updateProduct } from "../_actions/products";
import { useFormStatus } from "react-dom";
import { Product } from "@/generated/prisma";
import Image from "next/image";

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, action] = useActionState(
    product == null ? createProduct : updateProduct.bind(null, product.id),
    {}
  );

  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  
  return (
      <form action={action} className=" my-8 space-y-5">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product?.name}
          />
          {error.name && <div className="text-destructive">{error.name}</div>}
        </div>
        {/* Price Input */}
        <div className="space-y-2">
          <Label htmlFor="priceInCents">PriceInCents</Label>
          <Input
            type="number"
            id="priceInCents"
            name="priceInCents"
            value={priceInCents == undefined ? "" : priceInCents}
            required
            onKeyDown={(event) => {
              if (
                event.key === "e" ||
                event.key === "E" ||
                event.key === "+" ||
                event.key === "-"
              )
                event.preventDefault();
            }}
            onChange={(event) => setPriceInCents(Number(event.target.value))}
          />
          <div className="text-muted-foreground">
            {formatCurrency((priceInCents || 0) / 100)}
          </div>
          {error.priceInCents && (
            <div className="text-destructive">{error.priceInCents}</div>
          )}
        </div>
        {/* Image Input */}
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            type="file"
            id="image"
            name="image"
            required={product == null}
          />
          {error.image && <div className="text-destructive">{error.image}</div>}
          {product != null && (
            <Image
              src={product.imagePath}
              alt="Product Image"
              width="400"
              height="400"
            />
          )}
          {product != null && (
            <p className="pl-3.5 text-muted-foreground">{product.imagePath}</p>
          )}
        </div>
        {/* Submit Button */}
        <SubmitButton/>
      </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full p-6" type="submit" disabled={pending}>
      {pending ? "Saving" : "Save"}
    </Button>
  );
};
export default ProductForm;
