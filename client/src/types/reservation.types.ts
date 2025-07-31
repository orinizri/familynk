export interface productsProps {
  id: string;
  name: string;
  status?: string;
  charge?: number;
}

export interface reservationRowProps {
  id: string;
  activePurchasesSum: number;
  activeChargesSum: number;
  products?: productsProps[]
}
