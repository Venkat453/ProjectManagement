using Projects.Entities;
using Projects.Entities.MasterData;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Data.Configurations
{
    public class ReferenceGroupMasterConfiguration : EntityBaseConfiguration<tbl_reference_group_master>
    {
        public ReferenceGroupMasterConfiguration()
        {
            Property(rgm => rgm.group_id).IsRequired();
            Property(rgm => rgm.reference_item).IsRequired().HasMaxLength(100);
            Property(rgm => rgm.description).HasMaxLength(200);
        }
    }
}
