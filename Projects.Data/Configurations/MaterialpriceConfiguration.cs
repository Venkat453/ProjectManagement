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
    public class MaterialpriceConfiguration : EntityBaseConfiguration<tbl_material_price>
    {
        public MaterialpriceConfiguration()
        {
            Property(l => l.material_name).IsRequired().HasMaxLength(50);
            Property(l => l.material_description).IsRequired().HasMaxLength(200);

        }
    }
}

