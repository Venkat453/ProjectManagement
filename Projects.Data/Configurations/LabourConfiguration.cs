using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    public class LabourConfiguration : EntityBaseConfiguration<tbl_labour>
    {
        public LabourConfiguration()
        {
            Property(l => l.name).IsRequired().HasMaxLength(50);
            Property(l => l.mother_tongue).IsRequired().HasMaxLength(20);
        }
    }
}
