export type SettingsType = {
    date_format: string
    lang: string
    number_format: 'comma' | 'dot' | 'decimal' | 'money'
    printer_name: string | ""
    scale: number
    receipt_size: '80' | '58'
    fiscalization_enabled: boolean
    auto_print_receipt: boolean
    enable_create_unknown_product: boolean
    shift: {
        shift_enabled: boolean
    }
}
