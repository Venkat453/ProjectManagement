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
    class CityConfiguration : EntityBaseConfiguration<tbl_city>
    {

        public CityConfiguration()
        {
            Property(c => c.id).IsRequired();
            Property(c => c.city_name).IsRequired().HasMaxLength(50);
        }
    }
}
