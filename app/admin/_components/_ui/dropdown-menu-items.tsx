import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ProductActivationToggleTrigger,
  ProductDeletionTrigger,
} from "./product-action-triggers";
import Link from "next/link";

const ToggleActivationItem = ({id, isAvailable}:{ id: string, isAvailable:boolean }) => (
    <DropdownMenuItem>
    <ProductActivationToggleTrigger
      id={id}
      isAvailable={isAvailable}
    />
  </DropdownMenuItem>
);

const EditItem = ({id}:{ id: string; }) => (
  <DropdownMenuItem>
    <Link href={`/admin/products/${id}/edit`}>Edit</Link>
  </DropdownMenuItem>
);

const DeleteItem = ({id}:{ id: string}) => (
  <DropdownMenuItem>
    <ProductDeletionTrigger
      id={id}
    />
  </DropdownMenuItem>
);

export {
    ToggleActivationItem,
    EditItem,
    DeleteItem
}