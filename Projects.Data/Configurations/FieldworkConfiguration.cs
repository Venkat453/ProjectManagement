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
   public class FieldworkConfiguration: EntityBaseConfiguration<tbl_fieldwork_price>

    {
        public FieldworkConfiguration()
        {
            Property(l => l.fieldwork_name).IsRequired().HasMaxLength(50);
            Property(l => l.fieldwork_description).IsRequired().HasMaxLength(200);
        } 
    }
}
