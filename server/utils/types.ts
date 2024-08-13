export type ZohoHostedPageApiResponse = {
  code: number;
  message: string;
  hostedpage_id: string;
  status: string;
  url: string;
  action: string;
  expiring_time: string;
  created_time: string;
  custom_fields: Array<{
    index: number;
    label: string;
    value: string;
    data_type: string;
  }>;
  data: {
    subscription: {
      subscription_id: string;
      name: string;
      status: string;
      amount: number;
      created_at: string;
      current_term_starts_at: string;
      current_term_ends_at: string;
      next_billing_at: string;
      expires_at: string;
      interval: number;
      interval_unit: string;
      auto_collect: boolean;
      created_time: string;
      updated_time: string;
      reference_id: string;
      salesperson_id: string;
      salesperson_name: string;
      child_invoice_id: string;
      pricebook_id: string;
      currency_code: string;
      currency_symbol: string;
      end_of_term: boolean;
      product_id: string;
      product_name: string;
      plan: {
        plan_code: string;
        name: string;
        quantity: number;
        price: number;
        tags: Array<{
          tag_id: number;
          tag_option_id: number;
        }>;
        item_custom_fields: Array<{
          label: string;
          value: string;
        }>;
        discount: number;
        total: number;
        setup_fee: number;
        description: string;
        tax_id: string;
      };
      addons: Array<{
        addon_code: string;
        name: string;
        description: string;
        quantity: number;
        tags: Array<{
          tag_id: number;
          tag_option_id: number;
        }>;
        item_custom_fields: Array<{
          label: string;
          value: string;
        }>;
        price: number;
        discount: any;
        total: any;
        tax_id: any;
      }>;
      taxes: Array<string>;
      coupon: {
        coupon_code: string;
        discount_amount: number;
      };
      card: {
        card_id: string;
        last_four_digits: string;
        payment_gateway: string;
        expiry_month: number;
        expiry_year: number;
      };
      payment_terms: number;
      payment_terms_label: string;
      can_add_bank_account: boolean;
      customer: {
        customer_id: string;
        display_name: string;
        first_name: string;
        last_name: string;
        email: string;
        company_name: string;
        cf_user_id: string;
        billing_address: {
          street: string;
          city: string;
          state: string;
          country: string;
          zip: string;
          fax: string;
        };
        shipping_address: {
          attention: string;
          street: string;
          city: string;
          state: string;
          country: string;
          zip: string;
          fax: string;
        };
        is_taxable: boolean;
        tax_authority_name: string;
        tax_exemption_id: string;
        payment_terms: number;
        payment_terms_label: string;
      };
      custom_fields: Array<{
        index: number;
        label: string;
        value: string;
        data_type: string;
      }>;
      contactpersons: Array<{
        contactperson_id: string;
      }>;
      notes: Array<{
        note_id: string;
        description: string;
        commented_by: string;
        commented_time: string;
      }>;
      payment_gateways: Array<{
        payment_gateway: string;
      }>;
    };
    invoice: {
      invoice_id: string;
      number: string;
      status: string;
      invoice_date: string;
      due_date: string;
      payment_expected_date: string;
      ach_payment_initiated: boolean;
      transaction_type: string;
      customer_id: string;
      customer_name: string;
      email: string;
      invoice_items: Array<{
        item_id: string;
        name: string;
        description: string;
        code: string;
        price: number;
        quantity: number;
        discount_amount: number;
        item_total: number;
        tax_id: string;
        tax_exemption_id: string;
        tax_exemption_code: string;
      }>;
      coupon: Array<{
        coupon_code: string;
        coupon_name: string;
        discount_amount: number;
      }>;
      credits: Array<{
        creditnote_id: string;
        creditnotes_number: string;
        credited_date: string;
        credited_amount: number;
      }>;
      total: number;
      payment_made: number;
      balance: number;
      credits_applied: number;
      write_off_amount: number;
      payments: Array<{
        payment_id: string;
        payment_mode: string;
        invoice_payment_id: string;
        gateway_transaction_id: string;
        description: string;
        date: string;
        reference_number: string;
        amount: number;
        exchange_rate: number;
      }>;
      currency_code: string;
      currency_symbol: string;
      created_time: string;
      updated_time: string;
      salesperson_id: string;
      salesperson_name: string;
      invoice_url: string;
      billing_address: {
        city: string;
        state: string;
        zip: string;
        country: string;
        fax: string;
      };
      shipping_address: {
        attention: string;
        street: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        fax: string;
      };
      comments: Array<{
        comment_id: string;
        description: string;
        commented_by_id: string;
        commented_by: string;
        comment_type: string;
        date: any;
        time: string;
        operation_type: string;
        transaction_id: string;
        transaction_type: string;
      }>;
      custom_fields: Array<{
        index: number;
        label: string;
        value: string;
        data_type: string;
      }>;
    };
  };
};
