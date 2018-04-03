using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.Membership;

namespace Projects.Data.Configurations
{
    public class TenantConfiguration : EntityBaseConfiguration<tbl_tenant>
    {
        public TenantConfiguration()
        {
            Property(t => t.id).IsRequired();
            Property(t => t.tenant_key).IsRequired().HasMaxLength(20);
            Property(t => t.tenant_name).IsRequired().HasMaxLength(30);
            Property(t => t.domain).HasMaxLength(30);
            Property(t => t.pan).HasMaxLength(20);
            Property(t => t.tin).HasMaxLength(20);
            Property(t => t.vat).HasMaxLength(20);
            Property(t => t.bank_account_no).HasMaxLength(20);
            Property(t => t.bank_name).HasMaxLength(30);
            Property(t => t.bank_branch).HasMaxLength(30);
            Property(t => t.ifsc_code).HasMaxLength(15);
            Property(t => t.contact_person).HasMaxLength(30);
            Property(t => t.email).HasMaxLength(30);
            Property(t => t.contact_no).HasMaxLength(20);
            Property(t => t.alt_contact_no).HasMaxLength(20);
            Property(t => t.address).HasMaxLength(150);
            Property(t => t.comments).HasMaxLength(300);
            Property(t => t.logo_image_type).HasMaxLength(20);
        }
    }

    public class TenantAccountsDetailsConfiguration : EntityBaseConfiguration<tbl_tenant_accounts_details>
    {
        public TenantAccountsDetailsConfiguration()
        {
            Property(ta => ta.id).IsRequired();
            Property(ta => ta.tenant_id).IsRequired();
            Property(ta => ta.amount_paid).IsRequired();
            Property(t => t.fin_year).IsRequired().HasMaxLength(9);
            Property(ta => ta.paid_date).IsRequired();
            Property(t => t.payment_note).HasMaxLength(9);
        }
    }
}
