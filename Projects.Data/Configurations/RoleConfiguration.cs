using Projects.Entities;
using Projects.Entities.Membership;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    public class RoleConfiguration : EntityBaseConfiguration<tbl_roles>
    {
        public RoleConfiguration()
        {
            Property(ur => ur.Name).IsRequired().HasMaxLength(50);
        }
    }
}
