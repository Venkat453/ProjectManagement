using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;

namespace Projects.Entities.Membership
{
    public class tbl_tenant_accounts_details : IEntityBase
    {
        public int id { get; set; }
        [ForeignKey("tenant"), DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public float amount_paid { get; set; }
        public string fin_year { get; set; }
        public DateTime paid_date { get; set; }
        public string payment_note { get; set; }

        public virtual tbl_tenant tenant { get; set; }
    }
}
