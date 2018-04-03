using Projects.Data;
using Projects.Data.Configurations;
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
    public class StateConfiguration : EntityBaseConfiguration<tbl_state>
    {
        public StateConfiguration()
        {
            Property(s => s.id).IsRequired();
            Property(s => s.country_id).IsRequired();
            Property(s => s.state_name).IsRequired().HasMaxLength(100);
            Property(s => s.capital).HasMaxLength(100);
        }
    }
}
