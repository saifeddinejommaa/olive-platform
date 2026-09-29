export type Customer = {
  id: number;
  reference: string;
  name: string;
  phone: string | null;
  email: string | null;
  // Matricule fiscal.
  taxId: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  // Ventes livrées : nombre, litres et chiffre d'affaires TTC.
  salesCount: number;
  soldLiters: number;
  salesAmount: number;
};

export type CustomersFilter = {
  // Référence, nom, téléphone ou matricule fiscal.
  search?: string;
  isActive?: boolean;
};

export type SaveCustomerParams = {
  name: string;
  phone?: string;
  email?: string;
  taxId?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
};
