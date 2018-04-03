using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class AccountsMasterViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string account_name { get; set; }
        public int accounts_type { get; set; }
        public bool is_active { get; set; }
        public DateTime date_created { get; set; }
        public CompanyViewModel company { get; set; }
        public CustomerViewModel customer { get; set; }
        public RepresentativeViewModel rep { get; set; }
    }
}