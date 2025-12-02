import { Truck, type LucideProps } from "lucide-react";

export const Icons = {
  truck: Truck,
};

export function Logo(props: LucideProps) {
  return (
    <Truck {...props} />
  );
}
