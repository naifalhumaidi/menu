import { formatCurrency } from "@/lib/formatter";
import { Product } from "@/generated/prisma";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
// ? is using the "Product" prisma type ok here or I should've created a new Type for just needed props(id, name,..)?
const ProductCard = ({
  id,
  name,
  priceInCents,
  imagePath,
}: Product) => {
  return (
    <Card key={id} className="gap-3 overflow-hidden pt-0">
      <div className="relative aspect-video">
        <Image fill alt={name}
          src={imagePath}
        />
      </div>
      <CardHeader>
        <CardTitle>
          <h3 className="text-2xl">{name}</h3>
          <p className="text-sm">{formatCurrency(Number(priceInCents) / 100)}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        {/*  //!<CardDescription>
        </CardDescription> */}
      </CardContent>

      {/* //! <CardFooter> */}
{/*      </CardFooter> */}
    </Card>
  );
};

export default ProductCard;