import { Truck, type LucideProps, FileText, FileSignature, Layers, PackagePlus, Library, Send, Share2, Calculator } from "lucide-react";

export const Icons = {
  truck: Truck,
  fileText: FileText,
  fileSignature: FileSignature,
  layers: Layers,
  packagePlus: PackagePlus,
  library: Library,
  send: Send,
  share2: Share2,
  calculator: Calculator,
};

export function Logo(props: LucideProps) {
  return (
    <Truck {...props} />
  );
}
