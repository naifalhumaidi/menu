import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { ToggleActivationItem, EditItem, DeleteItem } from "./_ui/dropdown-menu-items";
type product = {
    name: string;
    id: string;
    priceInCents: number;
    isAvailable: boolean;
};

const ProductDropdownMenu = ({product}:{product:product}) => {
  return (
    <DropdownMenu>
        {/* Trigger */}
      <DropdownMenuTrigger className="cursor-pointer">
        <MoreVertical />
        <p className="sr-only">Actions</p>
      </DropdownMenuTrigger>
        {/* Content */}
      <DropdownMenuContent className="**:cursor-pointer">
        <ToggleActivationItem id={product.id} isAvailable={product.isAvailable}/>
        <EditItem id={product.id}/>
        <DeleteItem id={product.id}/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductDropdownMenu;

