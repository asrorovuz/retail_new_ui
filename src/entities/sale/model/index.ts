type InfoType = {
    address?: string;
    password?: string;
    username?: string;
    company_address?: string;
    company_inn?: string;
    company_name?: string;
    printer_size?: number;
    cashier_password?: number;
    com_port_number?: number;
}

export type FizcalResponsetype = {
    id: number;
    is_enabled: boolean;
    info: InfoType
    name: string;
    type: number;
}